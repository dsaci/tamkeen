import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MousePointer, Pen, Eraser, Minus, Square, Circle, Type, Undo2, Redo2,
  Download, Maximize, Minimize, ZapOff, Zap, Trash2, Moon, Sun, X,
  Triangle, Hexagon, Box, Star, Calculator, Image as ImageIcon,
  BookOpen, LogOut, Copy, ArrowUp, ArrowDown, AlignRight,
  AlignCenter, AlignLeft, Edit3, Move, Check,
  Crosshair, Spline, Database, Cone, FlaskConical, Battery, Activity, Shapes, Atom,
  Bold, Plus, Highlighter, Lightbulb, ToggleLeft, TestTube, Compass, Milestone, StickyNote, MessageSquare, CircleDot,
  PaintBucket, Sparkles, FolderOpen, Layers, GraduationCap, Globe, Languages, ChevronLeft, ChevronRight
} from 'lucide-react';
import { DraggableCalculator } from '../../components/DraggableCalculator';
import { EDUCATIONAL_ASSETS, EDUCATIONAL_CATEGORIES, EducationalAsset } from './whiteboard/educationalAssets';
import PresentationOverlay from './whiteboard/PresentationOverlay';
import WhiteboardToolboxModal from './whiteboard/WhiteboardToolboxModal';
import LessonKitGeneratorModal, { PrebuiltLessonKit } from './whiteboard/LessonKitGeneratorModal';
import LessonFlowBar from './whiteboard/LessonFlowBar';
import SavedBoardsModal, { SavedBoard } from './whiteboard/SavedBoardsModal';

// Types for all board elements
export type ElementType =
  | 'stroke'
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'hexagon'
  | 'cube'
  | 'star'
  | 'arrow'
  | 'text'
  | 'image'
  | 'asset'
  | 'cylinder'
  | 'cone'
  | 'axes'
  | 'parallelogram'
  | 'flask'
  | 'battery'
  | 'resistor'
  | 'bulb'
  | 'switch'
  | 'testtube'
  | 'compass'
  | 'timeline'
  | 'stickynote'
  | 'speechbubble'
  | 'venn';

export interface BoardElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  // Stroke specific
  points?: { x: number; y: number }[];
  // Style
  color: string;
  strokeWidth: number;
  fill?: string;
  fillOpacity?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  // Arrow specific
  arrowStart?: { x: number; y: number };
  arrowEnd?: { x: number; y: number };
  arrowControl?: { x: number; y: number };
  // Text specific
  text?: string;
  fontSize?: number;
  textAlign?: 'right' | 'center' | 'left';
  fontWeight?: 'bold' | 'normal';
  hasBackground?: boolean;
  // Image & Asset specific
  src?: string;
  assetId?: string;
  svgContent?: string;
  title?: string;
}

type ActiveTool =
  | 'select'
  | 'pen'
  | 'eraser'
  | 'arrow'
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'hexagon'
  | 'cube'
  | 'star'
  | 'text'
  | 'laser'
  | 'cylinder'
  | 'cone'
  | 'axes'
  | 'parallelogram'
  | 'flask'
  | 'battery'
  | 'resistor'
  | 'bulb'
  | 'switch'
  | 'testtube'
  | 'compass'
  | 'timeline'
  | 'stickynote'
  | 'speechbubble'
  | 'venn';

type BoardTheme = 'light' | 'dark';

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#000000'
];

const STROKE_WIDTHS = [2, 4, 8, 14, 22];

// Distance from point p to line segment (v, w)
function distToSegment(p: { x: number; y: number }, v: { x: number; y: number }, w: { x: number; y: number }): number {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

// Check if an element is touched by the eraser cursor
function checkElementHit(el: BoardElement, pos: { x: number; y: number }, radius = 24): boolean {
  if (el.type === 'stroke') {
    if (!el.points || el.points.length === 0) return false;
    for (let i = 0; i < el.points.length; i++) {
      const p = el.points[i];
      if (Math.hypot(p.x - pos.x, p.y - pos.y) <= radius + el.strokeWidth) return true;
      if (i > 0) {
        if (distToSegment(pos, el.points[i - 1], p) <= radius + el.strokeWidth) return true;
      }
    }
    return false;
  }

  if (el.type === 'arrow') {
    if (el.arrowStart && el.arrowEnd) {
      const ctrl = el.arrowControl || {
        x: (el.arrowStart.x + el.arrowEnd.x) / 2,
        y: (el.arrowStart.y + el.arrowEnd.y) / 2
      };
      if (distToSegment(pos, el.arrowStart, ctrl) <= radius + el.strokeWidth) return true;
      if (distToSegment(pos, ctrl, el.arrowEnd) <= radius + el.strokeWidth) return true;
      if (Math.hypot(el.arrowEnd.x - pos.x, el.arrowEnd.y - pos.y) <= radius + 12) return true;
    }
    return false;
  }

  if (el.type === 'text') {
    const fontSize = el.fontSize || 28;
    const lines = (el.text || '').split('\n');
    const lineCount = Math.max(1, lines.length);
    const approxCharPerLine = Math.max(...lines.map(l => l.length), 5);
    const textW = Math.max(el.width || 220, approxCharPerLine * (fontSize * 0.58) + 30);
    const textH = Math.max(el.height || 50, lineCount * (fontSize * 1.35) + 20);
    return (
      pos.x >= el.x - radius &&
      pos.x <= el.x + textW + radius &&
      pos.y >= el.y - radius &&
      pos.y <= el.y + textH + radius
    );
  }

  // All other elements: check expanded bounding box
  const minX = el.x - radius;
  const maxX = el.x + el.width + radius;
  const minY = el.y - radius;
  const maxY = el.y + el.height + radius;
  return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;
}

export default function WhiteboardView() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core board state
  const [elements, setElements] = useState<BoardElement[]>([]);
  const [history, setHistory] = useState<BoardElement[][]>([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Tool & selection state
  const [tool, setTool] = useState<ActiveTool>('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [color, setColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [theme, setTheme] = useState<BoardTheme>('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dialogs & widgets
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetCategory, setAssetCategory] = useState<string>('all');
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showGeometricShapesMenu, setShowGeometricShapesMenu] = useState(false);
  const [showOtherShapesMenu, setShowOtherShapesMenu] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Level 2 & 3 Pedagogical Modals & Presentation Overlays
  const [showToolboxModal, setShowToolboxModal] = useState(false);
  const [showLessonKitModal, setShowLessonKitModal] = useState(false);
  const [showCurtain, setShowCurtain] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [activeFill, setActiveFill] = useState<string>('transparent');
  const [activeStrokeStyle, setActiveStrokeStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');

  // Multi-page board state
  const [pages, setPages] = useState<BoardElement[][]>([[]]);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);

  // Lesson Flow Mode & Saved Boards Modals
  const [showLessonFlow, setShowLessonFlow] = useState(false);
  const [currentLessonStage, setCurrentLessonStage] = useState(1);
  const [showSavedBoardsModal, setShowSavedBoardsModal] = useState(false);

  // Smart Subject Context
  type SubjectContext = 'general' | 'math' | 'science' | 'geography' | 'history' | 'languages' | 'presentation';
  const [subjectContext, setSubjectContext] = useState<SubjectContext>('general');

  // Instant Focus & Select for direct text input
  useEffect(() => {
    if (editingTextId && textInputRef.current) {
      textInputRef.current.focus();
      if (textInputRef.current.value === 'نص جديد' || textInputRef.current.value === '') {
        textInputRef.current.select();
      }
    }
  }, [editingTextId]);

  // Dragging & transformation state
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'draw' | 'move' | 'resize' | 'arrow-control' | null>(null);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialElementState = useRef<BoardElement | null>(null);
  const currentDrawingElement = useRef<BoardElement | null>(null);

  // Eraser state
  const [eraserPos, setEraserPos] = useState({ x: -100, y: -100 });
  const isEraserPointerDown = useRef(false);
  const hasErasedInCurrentStroke = useRef(false);
  const latestElementsRef = useRef<BoardElement[]>(elements);
  latestElementsRef.current = elements;

  // Laser Pointer state
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  const [laserTrail, setLaserTrail] = useState<{ x: number; y: number; time: number }[]>([]);

  const isGeometricToolActive = ['rect', 'circle', 'triangle', 'hexagon', 'cube', 'star', 'axes', 'parallelogram', 'cylinder', 'cone'].includes(tool);
  const isOtherToolActive = [
    'flask', 'battery', 'resistor', 'bulb', 'switch', 'testtube',
    'compass', 'timeline', 'stickynote', 'speechbubble', 'venn'
  ].includes(tool);

  // Push new state to history stack
  const saveToHistory = useCallback((newElements: BoardElement[]) => {
    setHistory(prev => {
      const nextHistory = prev.slice(0, historyIdx + 1);
      return [...nextHistory, newElements];
    });
    setHistoryIdx(prev => prev + 1);
    setElements(newElements);
  }, [historyIdx]);

  const undo = () => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      setElements(history[newIdx]);
      setSelectedId(null);
    }
  };

  const redo = () => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      setElements(history[newIdx]);
      setSelectedId(null);
    }
  };

  const clearCanvas = () => {
    if (window.confirm('هل تريد حقاً مسح كامل محتويات السبورة؟')) {
      saveToHistory([]);
      setSelectedId(null);
    }
  };

  // Finish direct text editing and commit
  const finishEditingText = (id: string) => {
    const current = latestElementsRef.current.find(item => item.id === id);
    if (current) {
      if (!current.text || current.text.trim() === '') {
        const remaining = latestElementsRef.current.filter(item => item.id !== id);
        saveToHistory(remaining);
        setSelectedId(null);
      } else {
        saveToHistory(latestElementsRef.current);
      }
    }
    setEditingTextId(null);
  };

  // Helper to update selected shape attributes (fill, stroke, strokeWidth, strokeStyle)
  const updateSelectedShape = (updates: Partial<BoardElement>) => {
    if (!selectedId) return;
    const updated = elements.map(el => el.id === selectedId ? { ...el, ...updates } : el);
    setElements(updated);
    latestElementsRef.current = updated;
    saveToHistory(updated);
  };

  // Multi-page navigation
  const switchPage = (newIdx: number) => {
    if (newIdx === currentPageIdx || newIdx < 0 || newIdx >= pages.length) return;
    const updatedPages = [...pages];
    updatedPages[currentPageIdx] = elements;
    setPages(updatedPages);
    setCurrentPageIdx(newIdx);
    const targetElements = updatedPages[newIdx] || [];
    setElements(targetElements);
    latestElementsRef.current = targetElements;
    setHistory([targetElements]);
    setHistoryIdx(0);
    setSelectedId(null);
  };

  const addPage = () => {
    const updatedPages = [...pages];
    updatedPages[currentPageIdx] = elements;
    updatedPages.push([]);
    setPages(updatedPages);
    setCurrentPageIdx(updatedPages.length - 1);
    setElements([]);
    latestElementsRef.current = [];
    setHistory([[]]);
    setHistoryIdx(0);
    setSelectedId(null);
  };

  const deleteCurrentPage = () => {
    if (pages.length <= 1) {
      clearCanvas();
      return;
    }
    if (!window.confirm('هل تريد حذف هذه الصفحة من السبورة؟')) return;
    const updatedPages = pages.filter((_, i) => i !== currentPageIdx);
    const nextIdx = Math.max(0, currentPageIdx - 1);
    setPages(updatedPages);
    setCurrentPageIdx(nextIdx);
    const targetElements = updatedPages[nextIdx] || [];
    setElements(targetElements);
    latestElementsRef.current = targetElements;
    setHistory([targetElements]);
    setHistoryIdx(0);
    setSelectedId(null);
  };

  // Load Saved Board
  const handleLoadSavedBoard = (board: SavedBoard) => {
    const loadedPages = board.pages && board.pages.length > 0 ? board.pages : [[]];
    setPages(loadedPages);
    setCurrentPageIdx(0);
    const firstPage = loadedPages[0] || [];
    setElements(firstPage);
    latestElementsRef.current = firstPage;
    setHistory([firstPage]);
    setHistoryIdx(0);
    setSelectedId(null);
    setShowSavedBoardsModal(false);
  };

  // Lesson Flow Stage Action Callbacks
  const handleInsertLaunchSituation = () => {
    const newCard: BoardElement = {
      id: 'launch_' + Date.now(),
      type: 'stickynote',
      x: 220,
      y: 120,
      width: 420,
      height: 220,
      color: '#f59e0b',
      strokeWidth: 2,
      fill: '#fef3c7',
      fillOpacity: 0.95,
      text: '🚩 وضعية الانطلاق (المشكلة التعلمية):\n\nسياق المشكلة: .........................\nالمهمة المطلوبة: ما الذي تلاحظه؟ وكيف يمكنك تفسير ذلك؟',
      fontSize: 16,
      textAlign: 'right',
      fontWeight: 'bold',
    };
    saveToHistory([...elements, newCard]);
    setSelectedId(newCard.id);
  };

  const handleInsertInteractiveCards = () => {
    const cards: BoardElement[] = [
      {
        id: 'card1_' + Date.now(),
        type: 'stickynote',
        x: 180,
        y: 160,
        width: 180,
        height: 120,
        color: '#3b82f6',
        strokeWidth: 2,
        fill: '#dbeafe',
        fillOpacity: 0.95,
        text: '🔹 بطاقة 1: الفرضية الأولى',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      {
        id: 'card2_' + Date.now(),
        type: 'stickynote',
        x: 390,
        y: 160,
        width: 180,
        height: 120,
        color: '#10b981',
        strokeWidth: 2,
        fill: '#d1fae5',
        fillOpacity: 0.95,
        text: '🟢 بطاقة 2: الفرضية الثانية',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      {
        id: 'card3_' + Date.now(),
        type: 'stickynote',
        x: 600,
        y: 160,
        width: 180,
        height: 120,
        color: '#8b5cf6',
        strokeWidth: 2,
        fill: '#ede9fe',
        fillOpacity: 0.95,
        text: '🟣 بطاقة 3: الفرضية الثالثة',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
      }
    ];
    saveToHistory([...elements, ...cards]);
  };

  const handleInsertAssessment = () => {
    const cards: BoardElement[] = [
      {
        id: 'eval_q_' + Date.now(),
        type: 'text',
        x: 220,
        y: 100,
        width: 480,
        height: 60,
        color: '#1e293b',
        strokeWidth: 2,
        text: '❓ تقويم تكويني صفي: حدد صحة العبارة التالية مع التعليل',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        hasBackground: true
      },
      {
        id: 'eval_true_' + Date.now(),
        type: 'stickynote',
        x: 240,
        y: 190,
        width: 200,
        height: 120,
        color: '#10b981',
        strokeWidth: 2,
        fill: '#d1fae5',
        fillOpacity: 0.95,
        text: '✔️ صحيح\nالتعليل: ...........',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold'
      },
      {
        id: 'eval_false_' + Date.now(),
        type: 'stickynote',
        x: 480,
        y: 190,
        width: 200,
        height: 120,
        color: '#ef4444',
        strokeWidth: 2,
        fill: '#fee2e2',
        fillOpacity: 0.95,
        text: '❌ خطأ\nالتصحيح: ...........',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold'
      }
    ];
    saveToHistory([...elements, ...cards]);
  };

  const handleInsertExitTicket = () => {
    const ticket: BoardElement = {
      id: 'ticket_' + Date.now(),
      type: 'stickynote',
      x: 240,
      y: 120,
      width: 420,
      height: 240,
      color: '#6366f1',
      strokeWidth: 2,
      fill: '#e0e7ff',
      fillOpacity: 0.95,
      text: '🎫 بطاقة الخروج من الحصة (Exit Ticket):\n\n1. أهم فكرة أو مهارة تعلمتها اليوم: ..........\n2. سؤال لا زلت أبحث عن إجابته: ..........\n3. تقييمي لاستيعابي للحصة: ⭐⭐⭐⭐⭐',
      fontSize: 15,
      textAlign: 'right',
      fontWeight: 'bold'
    };
    saveToHistory([...elements, ticket]);
    setSelectedId(ticket.id);
  };

  // Keyboard shortcuts (Delete, Escape, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingTextId) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        saveToHistory(elements.filter(el => el.id !== selectedId));
        setSelectedId(null);
      } else if (e.key === 'Escape') {
        setSelectedId(null);
        if (editingTextId) finishEditingText(editingTextId);
      } else if (e.ctrlKey && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && (e.key === 'y' || e.key === 'Y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, elements, historyIdx, history, editingTextId]);

  // Fullscreen management
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // SVG Mouse Coordinates helper
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Add Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Compute reasonable scale to fit board
        const maxW = 350;
        const scale = Math.min(1, maxW / img.width);
        const w = img.width * scale;
        const h = img.height * scale;

        const newElement: BoardElement = {
          id: 'img_' + Date.now(),
          type: 'image',
          x: 200,
          y: 150,
          width: w,
          height: h,
          src,
          color: 'transparent',
          strokeWidth: 0,
          title: file.name
        };

        const updated = [...elements, newElement];
        saveToHistory(updated);
        setSelectedId(newElement.id);
        setTool('select');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add Educational Asset handler
  const handleAddAsset = (asset: EducationalAsset) => {
    const newElement: BoardElement = {
      id: 'asset_' + Date.now(),
      type: 'asset',
      assetId: asset.id,
      title: asset.title,
      src: asset.filePath,
      x: 120,
      y: 60,
      width: asset.width,
      height: asset.height,
      color: 'transparent',
      strokeWidth: 0,
    };

    const updated = [...elements, newElement];
    saveToHistory(updated);
    setSelectedId(newElement.id);
    setTool('select');
    setShowAssetModal(false);
  };

  // Laser effect animation tick
  useEffect(() => {
    if (tool !== 'laser') return;
    const interval = setInterval(() => {
      setLaserTrail(prev => {
        const now = Date.now();
        return prev.filter(p => now - p.time < 500);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [tool]);

  // Pointer interactions (Down, Move, Up)
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCoordinates(e);

    setShowGeometricShapesMenu(false);
    setShowOtherShapesMenu(false);

    if (tool === 'laser') {
      setLaserPos(pos);
      setLaserTrail(prev => [...prev, { x: pos.x, y: pos.y, time: Date.now() }]);
      return;
    }

    if (tool === 'eraser') {
      isEraserPointerDown.current = true;
      hasErasedInCurrentStroke.current = false;
      setEraserPos(pos);

      const target = e.target as SVGElement;
      const targetId = target.getAttribute('data-element-id');

      let remaining = latestElementsRef.current;
      if (targetId) {
        remaining = latestElementsRef.current.filter(el => el.id !== targetId);
        hasErasedInCurrentStroke.current = true;
        if (selectedId === targetId) setSelectedId(null);
      } else {
        const hitIds = new Set<string>();
        latestElementsRef.current.forEach(el => {
          if (checkElementHit(el, pos, 24)) hitIds.add(el.id);
        });
        if (hitIds.size > 0) {
          remaining = latestElementsRef.current.filter(el => !hitIds.has(el.id));
          hasErasedInCurrentStroke.current = true;
          if (selectedId && hitIds.has(selectedId)) setSelectedId(null);
        }
      }

      if (hasErasedInCurrentStroke.current) {
        latestElementsRef.current = remaining;
        setElements(remaining);
      }
      return;
    }

    if (tool === 'select') {
      const target = e.target as SVGElement;
      const handleType = target.getAttribute('data-handle');

      // 1. Check if user clicked a resize handle or arrow control handle on currently selected element
      if (handleType && selectedId) {
        const el = elements.find(item => item.id === selectedId);
        if (el) {
          setIsInteracting(true);
          if (handleType.startsWith('arrow-')) {
            setInteractionMode('arrow-control');
            setActiveHandle(handleType);
          } else {
            setInteractionMode('resize');
            setActiveHandle(handleType);
          }
          dragStartPos.current = pos;
          initialElementState.current = { ...el };
          return;
        }
      }

      // 2. Direct DOM hit testing (including ancestor <g data-element-id="...">)
      let foundId = target.getAttribute('data-element-id') ||
                    target.closest?.('[data-element-id]')?.getAttribute('data-element-id') || null;

      // 3. Robust Geometric Hit Testing (topmost element first) if DOM target was background
      if (!foundId) {
        for (let i = elements.length - 1; i >= 0; i--) {
          const el = elements[i];
          if (checkElementHit(el, pos, 14)) {
            foundId = el.id;
            break;
          }
        }
      }

      // 4. Element was hit -> Select & Grab immediately!
      if (foundId) {
        setSelectedId(foundId);
        setIsInteracting(true);
        setInteractionMode('move');
        dragStartPos.current = pos;
        const el = elements.find(item => item.id === foundId);
        initialElementState.current = el ? { ...el } : null;
      } else {
        // User clicked truly empty space -> Deselect and commit any text being edited
        if (editingTextId) {
          finishEditingText(editingTextId);
        }
        setSelectedId(null);
      }
      return;
    }

    if (tool === 'text') {
      // If there was already a text being edited, commit it first
      if (editingTextId) {
        finishEditingText(editingTextId);
      }

      // Create new text element directly at the clicked position
      const newElement: BoardElement = {
        id: 'text_' + Date.now(),
        type: 'text',
        x: pos.x,
        y: pos.y,
        width: 280,
        height: 60,
        text: 'نص جديد',
        fontSize: 28,
        textAlign: 'right',
        color: color,
        strokeWidth: 1,
        fontWeight: 'bold',
        hasBackground: false
      };
      saveToHistory([...elements, newElement]);
      setSelectedId(newElement.id);
      setEditingTextId(newElement.id);
      setTool('select');
      return;
    }

    // Drawing new shape or stroke
    setIsInteracting(true);
    setInteractionMode('draw');
    dragStartPos.current = pos;

    const newId = 'el_' + Date.now();
    let newElement: BoardElement;

    if (tool === 'pen') {
      newElement = {
        id: newId,
        type: 'stroke',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        points: [pos],
        color,
        strokeWidth
      };
    } else if (tool === 'arrow') {
      newElement = {
        id: newId,
        type: 'arrow',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        arrowStart: pos,
        arrowEnd: pos,
        arrowControl: pos,
        color,
        strokeWidth
      };
    } else {
      // Geometric Shapes
      newElement = {
        id: newId,
        type: tool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color,
        strokeWidth,
        fill: activeFill,
        strokeStyle: activeStrokeStyle
      };
    }

    currentDrawingElement.current = newElement;
    setElements(prev => [...prev, newElement]);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCoordinates(e);

    if (tool === 'laser') {
      setLaserPos(pos);
      setLaserTrail(prev => [...prev, { x: pos.x, y: pos.y, time: Date.now() }]);
      return;
    }

    if (tool === 'eraser') {
      setEraserPos(pos);
      if (isEraserPointerDown.current) {
        const hitIds = new Set<string>();
        latestElementsRef.current.forEach(el => {
          if (checkElementHit(el, pos, 24)) hitIds.add(el.id);
        });
        if (hitIds.size > 0) {
          const remaining = latestElementsRef.current.filter(el => !hitIds.has(el.id));
          latestElementsRef.current = remaining;
          setElements(remaining);
          hasErasedInCurrentStroke.current = true;
          if (selectedId && hitIds.has(selectedId)) setSelectedId(null);
        }
      }
      return;
    }

    if (!isInteracting) return;

    if (interactionMode === 'draw') {
      if (!currentDrawingElement.current) return;
      const el = currentDrawingElement.current;

      if (el.type === 'stroke') {
        const nextPoints = [...(el.points || []), pos];
        el.points = nextPoints;
        setElements(prev => prev.map(item => item.id === el.id ? { ...el, points: nextPoints } : item));
      } else if (el.type === 'arrow') {
        const start = el.arrowStart || dragStartPos.current;
        const end = pos;
        const control = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2
        };
        el.arrowEnd = end;
        el.arrowControl = control;
        setElements(prev => prev.map(item => item.id === el.id ? { ...el, arrowEnd: end, arrowControl: control } : item));
      } else {
        // Shapes
        const x = Math.min(dragStartPos.current.x, pos.x);
        const y = Math.min(dragStartPos.current.y, pos.y);
        const width = Math.abs(pos.x - dragStartPos.current.x);
        const height = Math.abs(pos.y - dragStartPos.current.y);

        el.x = x;
        el.y = y;
        el.width = width;
        el.height = height;

        setElements(prev => prev.map(item => item.id === el.id ? { ...el, x, y, width, height } : item));
      }
    } else if (interactionMode === 'move' && selectedId && initialElementState.current) {
      const dx = pos.x - dragStartPos.current.x;
      const dy = pos.y - dragStartPos.current.y;
      const initial = initialElementState.current;

      setElements(prev => prev.map(item => {
        if (item.id !== selectedId) return item;

        if (item.type === 'stroke') {
          const shiftPoints = (initial.points || []).map(p => ({ x: p.x + dx, y: p.y + dy }));
          return { ...item, points: shiftPoints, x: initial.x + dx, y: initial.y + dy };
        }

        if (item.type === 'arrow') {
          return {
            ...item,
            arrowStart: initial.arrowStart ? { x: initial.arrowStart.x + dx, y: initial.arrowStart.y + dy } : undefined,
            arrowEnd: initial.arrowEnd ? { x: initial.arrowEnd.x + dx, y: initial.arrowEnd.y + dy } : undefined,
            arrowControl: initial.arrowControl ? { x: initial.arrowControl.x + dx, y: initial.arrowControl.y + dy } : undefined,
          };
        }

        return {
          ...item,
          x: initial.x + dx,
          y: initial.y + dy
        };
      }));
    } else if (interactionMode === 'resize' && selectedId && initialElementState.current) {
      const dx = pos.x - dragStartPos.current.x;
      const dy = pos.y - dragStartPos.current.y;
      const initial = initialElementState.current;

      setElements(prev => prev.map(item => {
        if (item.id !== selectedId) return item;

        let newX = initial.x;
        let newY = initial.y;
        let newW = initial.width;
        let newH = initial.height;

        if (activeHandle === 'se') {
          newW = Math.max(20, initial.width + dx);
          newH = Math.max(20, initial.height + dy);
        } else if (activeHandle === 'sw') {
          newW = Math.max(20, initial.width - dx);
          newH = Math.max(20, initial.height + dy);
          newX = initial.x + (initial.width - newW);
        } else if (activeHandle === 'ne') {
          newW = Math.max(20, initial.width + dx);
          newH = Math.max(20, initial.height - dy);
          newY = initial.y + (initial.height - newH);
        } else if (activeHandle === 'nw') {
          newW = Math.max(20, initial.width - dx);
          newH = Math.max(20, initial.height - dy);
          newX = initial.x + (initial.width - newW);
          newY = initial.y + (initial.height - newH);
        }

        return { ...item, x: newX, y: newY, width: newW, height: newH };
      }));
    } else if (interactionMode === 'arrow-control' && selectedId && initialElementState.current) {
      setElements(prev => prev.map(item => {
        if (item.id !== selectedId) return item;
        if (activeHandle === 'arrow-start') {
          return { ...item, arrowStart: pos };
        }
        if (activeHandle === 'arrow-end') {
          return { ...item, arrowEnd: pos };
        }
        if (activeHandle === 'arrow-ctrl') {
          return { ...item, arrowControl: pos };
        }
        return item;
      }));
    }
  };

  const handlePointerUp = () => {
    if (tool === 'eraser') {
      if (isEraserPointerDown.current && hasErasedInCurrentStroke.current) {
        saveToHistory(latestElementsRef.current);
      }
      isEraserPointerDown.current = false;
      hasErasedInCurrentStroke.current = false;
      return;
    }

    if (!isInteracting) return;

    if (interactionMode === 'draw' && currentDrawingElement.current) {
      const cur = currentDrawingElement.current;
      let finalElements = elements;
      if (cur.type !== 'stroke' && cur.type !== 'arrow' && cur.type !== 'text') {
        if (cur.width < 15 && cur.height < 15) {
          const defaultW = cur.type === 'timeline' ? 340 : cur.type === 'venn' ? 240 : cur.type === 'stickynote' ? 160 : 130;
          const defaultH = cur.type === 'timeline' ? 70 : cur.type === 'venn' ? 140 : cur.type === 'stickynote' ? 140 : 120;
          finalElements = elements.map(el => el.id === cur.id ? { ...el, width: defaultW, height: defaultH } : el);
        }
      }
      saveToHistory(finalElements);
      setSelectedId(cur.id);
      currentDrawingElement.current = null;
      setTool('select');
    } else if (interactionMode === 'move' || interactionMode === 'resize' || interactionMode === 'arrow-control') {
      saveToHistory(elements);
    }

    setIsInteracting(false);
    setInteractionMode(null);
    setActiveHandle(null);
  };

  // Reorder layers (Bring forward / Send backward)
  const bringToFront = () => {
    if (!selectedId) return;
    const item = elements.find(el => el.id === selectedId);
    if (!item) return;
    const filtered = elements.filter(el => el.id !== selectedId);
    saveToHistory([...filtered, item]);
  };

  const sendToBack = () => {
    if (!selectedId) return;
    const item = elements.find(el => el.id === selectedId);
    if (!item) return;
    const filtered = elements.filter(el => el.id !== selectedId);
    saveToHistory([item, ...filtered]);
  };

  // Duplicate selected element
  const duplicateSelected = () => {
    if (!selectedId) return;
    const item = elements.find(el => el.id === selectedId);
    if (!item) return;
    const duplicated: BoardElement = {
      ...item,
      id: 'copy_' + Date.now(),
      x: item.x + 25,
      y: item.y + 25
    };
    saveToHistory([...elements, duplicated]);
    setSelectedId(duplicated.id);
  };

  // Text formatting updates
  const updateSelectedText = (updates: Partial<BoardElement>) => {
    if (!selectedId) return;
    const updated = elements.map(el => el.id === selectedId ? { ...el, ...updates } : el);
    saveToHistory(updated);
  };

  // Insert element directly from Level 2 Toolbox
  const handleInsertFromToolbox = (elementData: any) => {
    const newEl: BoardElement = {
      id: 'tb_' + Date.now(),
      x: 200 + Math.random() * 50,
      y: 150 + Math.random() * 50,
      width: elementData.width || 260,
      height: elementData.height || 180,
      color: elementData.color || color,
      strokeWidth: elementData.strokeWidth || strokeWidth,
      fill: elementData.fill || 'transparent',
      ...elementData
    };
    saveToHistory([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  // Apply complete Level 3 pre-engineered lesson kit
  const handleApplyLessonKit = (kit: PrebuiltLessonKit) => {
    const newEls = kit.elements.map((el, i) => ({
      ...el,
      id: 'kit_' + Date.now() + '_' + i,
      strokeWidth: el.strokeWidth || 2
    }));
    saveToHistory([...elements, ...newEls]);
    setSelectedId(null);
    if (kit.durationMinutes) {
      setShowTimer(true);
    }
  };

  // Subject Quick-Insert Handlers
  const handleInsertFractionStrip = () => {
    const newBar: BoardElement = {
      id: 'frac_' + Date.now(),
      type: 'rect',
      x: 240,
      y: 140,
      width: 480,
      height: 55,
      color: '#3b82f6',
      strokeWidth: 2.5,
      fill: '#dbeafe',
      fillOpacity: 0.8,
    };
    const newText: BoardElement = {
      id: 'frac_txt_' + Date.now(),
      type: 'text',
      x: 260,
      y: 205,
      width: 440,
      height: 40,
      color: '#1e293b',
      strokeWidth: 2,
      text: '1/5   |   2/5   |   3/5   |   4/5   |   5/5 (الوحدة)',
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold',
    };
    saveToHistory([...elements, newBar, newText]);
  };

  const handleInsertGrammarCard = () => {
    const card: BoardElement = {
      id: 'grammar_' + Date.now(),
      type: 'stickynote',
      x: 200,
      y: 130,
      width: 460,
      height: 220,
      color: '#10b981',
      strokeWidth: 2,
      fill: '#d1fae5',
      fillOpacity: 0.95,
      text: '📝 بطاقة إعراب نموذجية:\nالجملة: [كَتَبَ التِّلْمِيذُ الدَّرْسَ]\n• كَتَبَ: فعل ماضٍ مبني على الفتح الظاهر على آخره.\n• التِّلْمِيذُ: فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره.\n• الدَّرْسَ: مفعول به منصوب وعلامة نصبه الفتحة الظاهرة على آخره.',
      fontSize: 14,
      textAlign: 'right',
      fontWeight: 'bold',
    };
    saveToHistory([...elements, card]);
    setSelectedId(card.id);
  };

  const handleInsertTashkeelCard = () => {
    const card: BoardElement = {
      id: 'tashkeel_' + Date.now(),
      type: 'text',
      x: 240,
      y: 120,
      width: 420,
      height: 65,
      color: '#0284c7',
      strokeWidth: 2,
      text: 'َ  |  ً  |  ُ  |  ٌ  |  ِ  |  ٍ  |  ْ  |  ّ  (حركات التشكيل)',
      fontSize: 22,
      textAlign: 'center',
      fontWeight: 'bold',
      hasBackground: true
    };
    saveToHistory([...elements, card]);
    setSelectedId(card.id);
  };

  const handleInsertConjugationTable = () => {
    const card: BoardElement = {
      id: 'conjugation_' + Date.now(),
      type: 'stickynote',
      x: 200,
      y: 130,
      width: 430,
      height: 210,
      color: '#8b5cf6',
      strokeWidth: 2,
      fill: '#ede9fe',
      fillOpacity: 0.95,
      text: '🗣️ جدول تصريف الفعل في الماضي والمضارع:\n• أنا: كَتَبْتُ / أَكْتُبُ\n• نحنُ: كَتَبْنَا / نَكْتُبُ\n• أنتَ: كَتَبْتَ / تَكْتُبُ\n• هو: كَتَبَ / يَكْتُبُ\n• هُم: كَتَبُوا / يَكْتُبُونَ',
      fontSize: 14,
      textAlign: 'right',
      fontWeight: 'bold',
    };
    saveToHistory([...elements, card]);
    setSelectedId(card.id);
  };

  const handleInsertVocabTable = () => {
    const card: BoardElement = {
      id: 'vocab_' + Date.now(),
      type: 'stickynote',
      x: 220,
      y: 130,
      width: 420,
      height: 190,
      color: '#f59e0b',
      strokeWidth: 2,
      fill: '#fef3c7',
      fillOpacity: 0.95,
      text: '🏷️ شبكة المفردات (الكلمة، المرادف، الضد):\n• الكلمة: الشَّجَاعَةُ\n• المرادف: الإقدام، البسالة، الجرأة\n• الضد: الجُبْنُ، الخَوْفُ\n• التوظيف: يتحلى المجاهد بالشجاعة.',
      fontSize: 14,
      textAlign: 'right',
      fontWeight: 'bold',
    };
    saveToHistory([...elements, card]);
    setSelectedId(card.id);
  };

  const handleInsertNovember1954 = () => {
    const card: BoardElement = {
      id: 'nov1954_' + Date.now(),
      type: 'stickynote',
      x: 220,
      y: 120,
      width: 420,
      height: 210,
      color: '#ef4444',
      strokeWidth: 2,
      fill: '#fee2e2',
      fillOpacity: 0.95,
      text: '🇩🇿 اندلاع الثورة التحريرية (1 نوفمبر 1954):\n• بيان أول نوفمبر: الوثيقة المرجعية للثورة\n• الهدف: استرجاع الاستقلال الوطني وإقامة دولة ديمقراطية اجتماعية\n• المناطق العسكرية الست وقادتها الأبطال',
      fontSize: 14,
      textAlign: 'right',
      fontWeight: 'bold',
    };
    saveToHistory([...elements, card]);
    setSelectedId(card.id);
  };

  const handleInsertSoummam1956 = () => {
    const card: BoardElement = {
      id: 'soummam_' + Date.now(),
      type: 'stickynote',
      x: 220,
      y: 120,
      width: 420,
      height: 200,
      color: '#3b82f6',
      strokeWidth: 2,
      fill: '#dbeafe',
      fillOpacity: 0.95,
      text: '📜 مؤتمر الصومام (20 أوت 1956):\n• المكان: وادي الصومام (إفري - أوزلاقن)\n• القرارات: تنظيم جيش التحرير، إنشاء المجلس الوطني والمجلس التنسيقي\n• المبدأ: أولوية الداخل على الخارج والسياسي على العسكري',
      fontSize: 14,
      textAlign: 'right',
      fontWeight: 'bold',
    };
    saveToHistory([...elements, card]);
    setSelectedId(card.id);
  };

  const handleInsertIndependence1962 = () => {
    const card: BoardElement = {
      id: 'indep_' + Date.now(),
      type: 'stickynote',
      x: 220,
      y: 120,
      width: 420,
      height: 190,
      color: '#10b981',
      strokeWidth: 2,
      fill: '#d1fae5',
      fillOpacity: 0.95,
      text: '🎉 استرجاع السيادة الوطنية (5 جويلية 1962):\n• استفتاء تقرير المصير (1 جويلية 1962)\n• إعلان الاستقلال الرسمي وتتويج تضحيات مليون ونصف مليون شهيد\n• رفع العلم الجزائري خفاقاً في سماء الوطن',
      fontSize: 14,
      textAlign: 'right',
      fontWeight: 'bold',
    };
    saveToHistory([...elements, card]);
    setSelectedId(card.id);
  };

  const handleInsertBlankAlgeriaMap = () => {
    const asset = EDUCATIONAL_ASSETS.find(a => a.id === 'algeria-map-blank') || EDUCATIONAL_ASSETS.find(a => a.category === 'maps');
    if (asset) handleAddAsset(asset);
  };

  const handleInsertWilayasMap = () => {
    const asset = EDUCATIONAL_ASSETS.find(a => a.id === 'algeria-map-wilayas') || EDUCATIONAL_ASSETS.find(a => a.category === 'maps');
    if (asset) handleAddAsset(asset);
  };

  const handleInsertPeriodicTable = () => {
    const asset = EDUCATIONAL_ASSETS.find(a => a.id === 'periodic-table') || EDUCATIONAL_ASSETS.find(a => a.category === 'physics');
    if (asset) handleAddAsset(asset);
  };

  // Export board as PNG
  const exportAsPNG = () => {
    if (!svgRef.current) return;
    const svgString = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const rect = svgRef.current?.getBoundingClientRect() || { width: 1200, height: 800 };
      canvas.width = rect.width * 2; // High-res export
      canvas.height = rect.height * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill background
      ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const a = document.createElement('a');
      a.download = `tamkeen-whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  const selectedElement = elements.find(el => el.id === selectedId);
  const bgColor = theme === 'dark' ? '#0f172a' : '#ffffff';

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-4.5rem)] flex flex-col gap-2 font-['Cairo'] select-none animate-in fade-in duration-300"
      dir="rtl"
    >
      {/* ═══════════ TOP HEADER BAR ═══════════ */}
      <div className="flex items-center justify-between gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-wrap">
        
        {/* Right: Exit / Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/40 transition-all shadow-sm"
            title="الخروج من السبورة والعودة للمنصة"
          >
            <LogOut size={15} />
            <span>خروج</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Pen size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">السبورة التفاعلية الذكية</h2>
              <span className="text-[10px] font-bold text-amber-500">تمكين PRO التعليمية</span>
            </div>
          </div>
        </div>

        {/* Center: Pedagogical Controls & Multi-page */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Saved Boards & Teacher Library */}
          <button
            onClick={() => setShowSavedBoardsModal(true)}
            className="px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            title="سبوراتي ومكتبة الدروس المحفوظة"
          >
            <FolderOpen size={15} />
            <span>سبوراتي المحفوظة 📁</span>
          </button>

          {/* Lesson Flow Mode Toggle */}
          <button
            onClick={() => setShowLessonFlow(prev => !prev)}
            className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all border ${
              showLessonFlow
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 border-purple-400 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
            title="تفعيل وضع مراحل الحصة البيداغوجية الست"
          >
            <GraduationCap size={15} className={showLessonFlow ? 'text-amber-300 animate-pulse' : 'text-purple-500'} />
            <span>وضع الحصة 🎓</span>
          </button>

          {/* Multi-page Controller */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => switchPage(currentPageIdx - 1)}
              disabled={currentPageIdx === 0}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all"
              title="الصفحة السابقة"
            >
              <ChevronRight size={15} />
            </button>
            <span className="text-xs font-black text-slate-700 dark:text-slate-200 px-1 select-none flex items-center gap-1">
              <Layers size={13} className="text-amber-500" />
              <span>{currentPageIdx + 1} / {pages.length}</span>
            </span>
            <button
              onClick={() => switchPage(currentPageIdx + 1)}
              disabled={currentPageIdx === pages.length - 1}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all"
              title="الصفحة التالية"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={addPage}
              className="p-1 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all"
              title="إضافة صفحة جديدة +"
            >
              <Plus size={15} />
            </button>
            {pages.length > 1 && (
              <button
                onClick={deleteCurrentPage}
                className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all"
                title="حذف هذه الصفحة"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

          {/* Media Assets Library */}
          <button
            onClick={() => setShowAssetModal(true)}
            className="px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <BookOpen size={15} />
            <span>الرسوم والخرائط 🗺️</span>
          </button>

          {/* Upload Image */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
          >
            <ImageIcon size={15} className="text-amber-500" />
            <span>إدراج صورة</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Draggable Calculator Toggle */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
              showCalculator
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Calculator size={15} className={showCalculator ? 'text-white' : 'text-amber-500'} />
            <span>آلة حاسبة</span>
          </button>
        </div>

        {/* Left: General Controls (Laser, Theme, Undo/Redo, PNG, Fullscreen) */}
        <div className="flex items-center gap-1.5">
          {/* Laser Pointer */}
          <button
            onClick={() => setTool(tool === 'laser' ? 'select' : 'laser')}
            className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
              tool === 'laser'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
            title="مؤشر الليزر للشرح"
          >
            {tool === 'laser' ? <Zap size={15} /> : <ZapOff size={15} />}
            <span>ليزر</span>
          </button>

          {/* Theme */}
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:scale-105 transition-all"
            title="تبديل النمط (داكن / فاتح)"
          >
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* Undo / Redo */}
          <button
            onClick={undo}
            disabled={historyIdx <= 0}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none"
            title="تراجع (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={historyIdx >= history.length - 1}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none"
            title="إعادة (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40"
            title="مسح الكل"
          >
            <Trash2 size={16} />
          </button>

          {/* Export PNG */}
          <button
            onClick={exportAsPNG}
            className="px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
            title="تصدير كصورة PNG"
          >
            <Download size={15} />
            <span>تصدير</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:scale-105 transition-all"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      {/* ═══════════ LESSON FLOW MODE BAR (6-STAGE PEDAGOGICAL STEPPER) ═══════════ */}
      {showLessonFlow && (
        <LessonFlowBar
          currentStage={currentLessonStage}
          onSelectStage={setCurrentLessonStage}
          onInsertLaunchSituation={handleInsertLaunchSituation}
          onToggleCurtain={() => setShowCurtain(prev => !prev)}
          onToggleSpotlight={() => setShowSpotlight(prev => !prev)}
          onStartTimer={(_min) => setShowTimer(true)}
          onSpinWheel={() => setShowPicker(true)}
          onInsertInteractiveCards={handleInsertInteractiveCards}
          onInsertAssessment={handleInsertAssessment}
          onInsertExitTicket={handleInsertExitTicket}
          onSaveLessonBoard={() => setShowSavedBoardsModal(true)}
        />
      )}

      {/* ═══════════ SMART SUBJECT CONTEXTUAL TOOLBAR ═══════════ */}
      <div className="flex flex-col gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
        {/* Subject Switcher Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black text-slate-400 px-2 shrink-0">المادة / المجال:</span>
            {[
              { id: 'general', label: '🌟 عام وشامل', color: 'border-amber-400 text-amber-600 dark:text-amber-400' },
              { id: 'math', label: '📐 رياضيات وهندسة', color: 'border-indigo-400 text-indigo-600 dark:text-indigo-400' },
              { id: 'science', label: '🔬 علوم وفيزياء', color: 'border-emerald-400 text-emerald-600 dark:text-emerald-400' },
              { id: 'geography', label: '🌍 جغرافيا وخرائط', color: 'border-sky-400 text-sky-600 dark:text-sky-400' },
              { id: 'history', label: '📜 تاريخ وثورة', color: 'border-rose-400 text-rose-600 dark:text-rose-400' },
              { id: 'languages', label: '🗣️ لغات وقواعد', color: 'border-purple-400 text-purple-600 dark:text-purple-400' },
              { id: 'presentation', label: '🎭 إدارة وتفاعل صفي', color: 'border-yellow-400 text-yellow-600 dark:text-yellow-400' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSubjectContext(item.id as SubjectContext)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 border ${
                  subjectContext === item.id
                    ? `bg-slate-100 dark:bg-slate-800 ${item.color} shadow-sm scale-105`
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick toolbox shortcut */}
          <button
            onClick={() => setShowToolboxModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shrink-0 shadow-sm flex items-center gap-1.5 hover:scale-105 transition-all"
          >
            <Calculator size={14} />
            <span>صندوق الأدوات البيداغوجي 🧰</span>
          </button>
        </div>

        {/* Subject Contextual Quick Ribbon (One-click tools) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1.5 border-t border-slate-100 dark:border-slate-800/80 scrollbar-none">
          {subjectContext === 'math' && (
            <>
              <span className="text-[10px] font-black text-indigo-500 px-1 shrink-0">أدوات الرياضيات السريعة:</span>
              <button onClick={() => { setTool('axes'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'axes' ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>➕ معلم متعامد</button>
              <button onClick={() => { setTool('cube'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'cube' ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>🧊 مكعب 3D</button>
              <button onClick={() => { setTool('triangle'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'triangle' ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>🔺 مثلث</button>
              <button onClick={() => { setTool('cylinder'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'cylinder' ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>🛢️ أسطوانة</button>
              <button onClick={() => { setTool('cone'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'cone' ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>🍦 مخروط</button>
              <button onClick={handleInsertFractionStrip} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 hover:scale-105">➗ شريط كسور</button>
              <button onClick={() => setShowCalculator(true)} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 hover:scale-105">🔢 آلة حاسبة</button>
            </>
          )}

          {subjectContext === 'science' && (
            <>
              <span className="text-[10px] font-black text-emerald-500 px-1 shrink-0">أدوات المخبر والفيزياء:</span>
              <button onClick={() => { setTool('testtube'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'testtube' ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>🧪 أنبوب اختبار</button>
              <button onClick={() => { setTool('flask'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'flask' ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>⚗️ دورق مخبري</button>
              <button onClick={() => { setTool('battery'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'battery' ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>🔋 بطارية دارة</button>
              <button onClick={() => { setTool('bulb'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'bulb' ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>💡 مصباح كهربائي</button>
              <button onClick={() => { setTool('switch'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'switch' ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>⚡ قاطعة دارة</button>
              <button onClick={() => { setTool('resistor'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'resistor' ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>〰️ مقاومة R</button>
              <button onClick={handleInsertPeriodicTable} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 hover:scale-105">⚛️ الجدول الدوري</button>
              <button onClick={() => { setAssetCategory('biology'); setShowAssetModal(true); }} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 hover:scale-105">🫀 جسم الإنسان والعلوم</button>
            </>
          )}

          {subjectContext === 'geography' && (
            <>
              <span className="text-[10px] font-black text-sky-500 px-1 shrink-0">خرائط وتضاريس الجزائر:</span>
              <button onClick={handleInsertBlankAlgeriaMap} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 hover:scale-105">🇩🇿 خريطة الجزائر الصماء</button>
              <button onClick={handleInsertWilayasMap} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:scale-105">🗺️ خريطة الولايات الـ 58</button>
              <button onClick={() => { setTool('compass'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'compass' ? 'bg-sky-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>🧭 وردة الرياح والاتجاهات</button>
              <button onClick={() => { setAssetCategory('maps'); setShowAssetModal(true); }} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-300 hover:scale-105">⛰️ مكتبة الخرائط والتضاريس</button>
            </>
          )}

          {subjectContext === 'history' && (
            <>
              <span className="text-[10px] font-black text-rose-500 px-1 shrink-0">محطات الثورة والتاريخ الجزائري:</span>
              <button onClick={() => { setTool('timeline'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'timeline' ? 'bg-rose-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>⏳ خط زمني تفاعلي</button>
              <button onClick={handleInsertNovember1954} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 hover:scale-105">🇩🇿 أول نوفمبر 1954</button>
              <button onClick={handleInsertSoummam1956} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:scale-105">📜 مؤتمر الصومام 1956</button>
              <button onClick={handleInsertIndependence1962} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 hover:scale-105">🎉 عيد الاستقلال 1962</button>
              <button onClick={() => { setAssetCategory('history'); setShowAssetModal(true); }} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 hover:scale-105">🎖️ شخصيات وأعلام الثورة</button>
            </>
          )}

          {subjectContext === 'languages' && (
            <>
              <span className="text-[10px] font-black text-purple-500 px-1 shrink-0">أدوات اللغة والقواعد:</span>
              <button onClick={handleInsertGrammarCard} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:scale-105">📝 بطاقة إعراب نموذجية</button>
              <button onClick={handleInsertTashkeelCard} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 hover:scale-105">َ ُ ِ ْ ّ لوحة التشكيل السريع</button>
              <button onClick={() => { setTool('speechbubble'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'speechbubble' ? 'bg-purple-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>💬 فقاعة حوار</button>
              <button onClick={handleInsertConjugationTable} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 hover:scale-105">🔄 جدول تصريف الأفعال</button>
              <button onClick={handleInsertVocabTable} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 hover:scale-105">🏷️ شبكة المفردات والأضداد</button>
            </>
          )}

          {subjectContext === 'presentation' && (
            <>
              <span className="text-[10px] font-black text-yellow-600 px-1 shrink-0">أدوات إدارة وتنشيط الصف:</span>
              <button onClick={() => setShowCurtain(prev => !prev)} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:scale-105">🎭 الستارة الساترة</button>
              <button onClick={() => setShowSpotlight(prev => !prev)} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:scale-105">💡 كشاف التركيز</button>
              <button onClick={() => setShowTimer(prev => !prev)} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:scale-105">⏱️ مؤقت الحصة</button>
              <button onClick={() => setShowPicker(prev => !prev)} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:scale-105">🎡 قرعة اختيار تلميذ</button>
              <button onClick={handleInsertAssessment} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:scale-105">✔️❌ بطاقات صح أم خطأ</button>
              <button onClick={handleInsertExitTicket} className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:scale-105">🎫 بطاقة الخروج</button>
            </>
          )}

          {subjectContext === 'general' && (
            <>
              <span className="text-[10px] font-black text-slate-400 px-1 shrink-0">أدوات سريعة:</span>
              <button onClick={() => { setTool('pen'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'pen' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>✏️ قلم حر</button>
              <button onClick={() => { setTool('text'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'text' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>🔤 نص مباشر</button>
              <button onClick={() => { setTool('arrow'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'arrow' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>↗️ سهم ذكي</button>
              <button onClick={() => { setTool('stickynote'); setSelectedId(null); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border transition-all ${tool === 'stickynote' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>📌 ملاحظة لاصقة</button>
              <button onClick={() => setShowLessonKitModal(true)} className="px-2.5 py-1 rounded-lg text-xs font-black shrink-0 border bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:scale-105 transition-all">⚡ أنشئ لي (كبسولة درس)</button>
            </>
          )}
        </div>
      </div>

      {/* ═══════════ MAIN CANVAS & TOOLBAR AREA ═══════════ */}
      <div className="flex flex-1 gap-2 min-h-0 relative">
        
        {/* Left Vertical Toolbar (Drawing Tools) */}
        <div className="flex flex-col gap-2 z-20 shrink-0">
          
          {/* Main Drawing Tools Group */}
          <div className="bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1.5 items-center">
            
            {/* Select & Move Pointer */}
            <button
              onClick={() => {
                setTool('select');
                setShowGeometricShapesMenu(false);
                setShowOtherShapesMenu(false);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                tool === 'select'
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-lg shadow-amber-500/30 scale-105'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="تحديد ومسك وتحريك العناصر 👆"
            >
              <MousePointer size={18} />
            </button>

            {/* Freehand Pen */}
            <button
              onClick={() => {
                setTool('pen');
                setSelectedId(null);
                setShowGeometricShapesMenu(false);
                setShowOtherShapesMenu(false);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                tool === 'pen'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="قلم حر ✏️"
            >
              <Pen size={18} />
            </button>

            {/* Eraser Tool */}
            <button
              onClick={() => {
                setTool('eraser');
                setSelectedId(null);
                setShowGeometricShapesMenu(false);
                setShowOtherShapesMenu(false);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                tool === 'eraser'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105 ring-2 ring-rose-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="ممحاة ذكية لمسح الخطوط والأشكال 🧼"
            >
              <Eraser size={18} />
            </button>

            {/* Interactive Arrow with handles */}
            <button
              onClick={() => {
                setTool('arrow');
                setSelectedId(null);
                setShowGeometricShapesMenu(false);
                setShowOtherShapesMenu(false);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                tool === 'arrow'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="سهم ذكي مع نقاط تحكم ↗️"
            >
              <Minus size={18} className="rotate-45" />
            </button>

            {/* Text Tool */}
            <button
              onClick={() => {
                setTool('text');
                setSelectedId(null);
                setShowGeometricShapesMenu(false);
                setShowOtherShapesMenu(false);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                tool === 'text'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="إدراج نص 🔤"
            >
              <Type size={18} />
            </button>

            <div className="w-6 h-px bg-slate-800 my-0.5"></div>

            {/* Geometric Shapes Dropdown Trigger */}
            <button
              onClick={() => {
                setShowGeometricShapesMenu(!showGeometricShapesMenu);
                setShowOtherShapesMenu(false);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
                isGeometricToolActive || showGeometricShapesMenu
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105 ring-2 ring-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="الأشكال الهندسية 📐"
            >
              <Shapes size={18} />
              {isGeometricToolActive && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1"></span>
              )}
            </button>

            {/* Other Shapes Dropdown Trigger */}
            <button
              onClick={() => {
                setShowOtherShapesMenu(!showOtherShapesMenu);
                setShowGeometricShapesMenu(false);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
                isOtherToolActive || showOtherShapesMenu
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="أشكال ورسومات أخرى (علوم وفيزياء) 🔬"
            >
              <Atom size={18} />
              {isOtherToolActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1"></span>
              )}
            </button>

            <div className="w-6 h-px bg-slate-800 my-0.5"></div>

            {/* Level 2: Pedagogical Toolbox Trigger */}
            <button
              onClick={() => {
                setShowToolboxModal(true);
                setShowGeometricShapesMenu(false);
                setShowOtherShapesMenu(false);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95"
              title="صندوق الأدوات البيداغوجي الشامل (المستوى 2) 🧰"
            >
              <Calculator size={18} className="animate-pulse" />
            </button>

            {/* Level 3: 'أنشئ لي' Prebuilt Lesson Kits Trigger */}
            <button
              onClick={() => {
                setShowLessonKitModal(true);
                setShowGeometricShapesMenu(false);
                setShowOtherShapesMenu(false);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 ring-1 ring-purple-400"
              title="المستوى 3 — «أنشئ لي» (كبسولات الدروس والأنشطة الجاهزة) ⚡"
            >
              <Sparkles size={18} className="animate-spin" style={{ animationDuration: '8s' }} />
            </button>

            {/* Classroom Presentation Tools Quick Launcher (Timer) */}
            <button
              onClick={() => setShowTimer(!showTimer)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                showTimer
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="مؤقت الحصة الصفي ⏱️"
            >
              <Activity size={18} />
            </button>
          </div>

          {/* ═══════════ Geometric Shapes Dropdown Drawer ═══════════ */}
          {showGeometricShapesMenu && (
            <div className="absolute top-10 right-14 z-50 w-72 bg-slate-900/95 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-2xl animate-in slide-in-from-right-3 text-right">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Shapes size={16} />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xs">الأشكال الهندسية</h4>
                    <span className="text-[10px] text-slate-400">ثنائية وثلاثية الأبعاد ومعالم</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowGeometricShapesMenu(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X size={14} />
                </button>
              </div>

              {/* 2D Shapes */}
              <div className="space-y-1.5 mb-3">
                <span className="text-[10px] font-black text-amber-400 px-1">أشكال ثنائية الأبعاد (2D)</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'rect', icon: Square, label: 'مستطيل / مربع' },
                    { id: 'circle', icon: Circle, label: 'دائرة / بيضوي' },
                    { id: 'triangle', icon: Triangle, label: 'مثلث' },
                    { id: 'hexagon', icon: Hexagon, label: 'سداسي منتظم' },
                    { id: 'parallelogram', icon: Spline, label: 'متوازي أضلاع' },
                    { id: 'star', icon: Star, label: 'نجمة' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTool(item.id as ActiveTool);
                        setSelectedId(null);
                        setShowGeometricShapesMenu(false);
                      }}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                        tool === item.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                      }`}
                    >
                      <item.icon size={15} className={tool === item.id ? 'text-slate-950' : 'text-amber-400'} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Shapes & Axes */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-indigo-400 px-1">مجسمات ثلاثية الأبعاد ومعالم</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'axes', icon: Crosshair, label: 'معلم متعامد' },
                    { id: 'cube', icon: Box, label: 'مكعب 3D' },
                    { id: 'cylinder', icon: Database, label: 'أسطوانة' },
                    { id: 'cone', icon: Cone, label: 'مخروط' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTool(item.id as ActiveTool);
                        setSelectedId(null);
                        setShowGeometricShapesMenu(false);
                      }}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                        tool === item.id
                          ? 'bg-indigo-500 text-white border-indigo-400 shadow-md font-black'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                      }`}
                    >
                      <item.icon size={15} className={tool === item.id ? 'text-white' : 'text-indigo-400'} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ Other Educational Shapes Dropdown Drawer ═══════════ */}
          {showOtherShapesMenu && (
            <div className="absolute top-20 right-14 z-50 w-72 bg-slate-900/95 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-2xl animate-in slide-in-from-right-3 text-right">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Atom size={16} />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xs">أشكال ورسومات أخرى</h4>
                    <span className="text-[10px] text-slate-400">علوم، فيزياء، ومخططات توضيحية</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowOtherShapesMenu(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-0.5">
                {/* Section 1: Physics & Chemistry */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-emerald-400 px-1">الفيزياء، الكيمياء والمخبر 🧪</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'flask', icon: FlaskConical, label: 'دورق مخبري' },
                      { id: 'bulb', icon: Lightbulb, label: 'مصباح كهربائي' },
                      { id: 'battery', icon: Battery, label: 'بطارية دارة' },
                      { id: 'resistor', icon: Activity, label: 'مقاومة كهربائية' },
                      { id: 'switch', icon: ToggleLeft, label: 'قاطعة دارة' },
                      { id: 'testtube', icon: TestTube, label: 'أنبوب اختبار' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTool(item.id as ActiveTool);
                          setSelectedId(null);
                          setShowOtherShapesMenu(false);
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                          tool === item.id
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-md font-black'
                            : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                        }`}
                      >
                        <item.icon size={15} className={tool === item.id ? 'text-white' : 'text-emerald-400'} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: History & Geography */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-sky-400 px-1">التاريخ والجغرافيا 🗺️</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'timeline', icon: Milestone, label: 'خط زمني' },
                      { id: 'compass', icon: Compass, label: 'وردة الرياح' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTool(item.id as ActiveTool);
                          setSelectedId(null);
                          setShowOtherShapesMenu(false);
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                          tool === item.id
                            ? 'bg-sky-500 text-white border-sky-400 shadow-md font-black'
                            : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                        }`}
                      >
                        <item.icon size={15} className={tool === item.id ? 'text-white' : 'text-sky-400'} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Pedagogy & Presentation */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-amber-400 px-1">العرض والبيداغوجيا 💡</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'stickynote', icon: StickyNote, label: 'ملاحظة لاصقة' },
                      { id: 'speechbubble', icon: MessageSquare, label: 'فقاعة حوار' },
                      { id: 'venn', icon: CircleDot, label: 'مخطط مقارنة' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTool(item.id as ActiveTool);
                          setSelectedId(null);
                          setShowOtherShapesMenu(false);
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                          tool === item.id
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                            : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                        }`}
                      >
                        <item.icon size={15} className={tool === item.id ? 'text-slate-950' : 'text-amber-400'} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stroke Width Selector */}
          <div className="bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center gap-2 py-2.5">
            {STROKE_WIDTHS.map(w => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={`rounded-full transition-all flex items-center justify-center ${
                  strokeWidth === w ? 'bg-amber-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'
                }`}
                style={{ width: Math.max(8, w * 1.3), height: Math.max(8, w * 1.3) }}
                title={`سمك الخط: ${w}px`}
              />
            ))}
          </div>
        </div>

        {/* ═══════════ SVG CANVAS CONTAINER ═══════════ */}
        <div
          className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
          style={{
            cursor:
              tool === 'laser'
                ? 'none'
                : tool === 'eraser'
                ? 'crosshair'
                : tool === 'select'
                ? 'default'
                : tool === 'text'
                ? 'text'
                : 'crosshair',
            touchAction: 'none'
          }}
        >
          {/* Floating Color Palette Toggle in Canvas Top-Right */}
          <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2">
            <button
              onClick={() => setShowColorMenu(!showColorMenu)}
              className="w-10 h-10 rounded-2xl border-2 border-white dark:border-slate-800 shadow-xl transition-all hover:scale-105 flex items-center justify-center"
              style={{ backgroundColor: color }}
              title="اختيار اللون"
            >
              <div className="w-3.5 h-3.5 bg-white/40 rounded-full blur-[1px]"></div>
            </button>

            {showColorMenu && (
              <div className="bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl flex flex-col gap-2 shadow-2xl border border-slate-800 animate-in slide-in-from-top-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      if (selectedId) {
                        setElements(prev => prev.map(el => el.id === selectedId ? { ...el, color: c } : el));
                      }
                      setShowColorMenu(false);
                    }}
                    className={`w-7 h-7 rounded-full transition-all border flex items-center justify-center ${
                      color === c ? 'scale-110 border-amber-400 shadow-md' : 'border-slate-700 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <div className="w-2 h-2 bg-black/40 rounded-full" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Text Floating Formatting Ribbon */}
          {selectedElement && selectedElement.type === 'text' && (
            <div
              className="absolute z-50 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-2 text-white text-xs animate-in zoom-in-95 duration-150 select-none"
              style={{
                top: Math.max(10, selectedElement.y - 54),
                left: Math.max(10, selectedElement.x - 20)
              }}
              onMouseDown={e => e.preventDefault()}
            >
              {/* Edit / Commit Mode Toggle */}
              {editingTextId === selectedElement.id ? (
                <button
                  onClick={() => finishEditingText(selectedElement.id)}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                  title="تثبيت النص على السبورة (Ctrl+Enter)"
                >
                  <Check size={14} />
                  <span>تثبيت</span>
                </button>
              ) : (
                <button
                  onClick={() => setEditingTextId(selectedElement.id)}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all"
                  title="كتابة وتحرير النص مباشرة (أو نقر مزدوج)"
                >
                  <Edit3 size={13} />
                  <span>تحرير</span>
                </button>
              )}

              <div className="h-5 w-px bg-slate-700"></div>

              {/* Font Size Stepper (A- / Number / A+) */}
              <div className="flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-slate-700/60">
                <button
                  onClick={() => updateSelectedText({ fontSize: Math.max(14, (selectedElement.fontSize || 28) - 4) })}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                  title="تصغير الخط (A-)"
                >
                  <Minus size={12} />
                </button>
                <span className="px-1.5 font-mono font-black text-xs text-amber-400 min-w-[34px] text-center">
                  {selectedElement.fontSize || 28}
                </span>
                <button
                  onClick={() => updateSelectedText({ fontSize: Math.min(84, (selectedElement.fontSize || 28) + 4) })}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                  title="تكبير الخط (A+)"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Quick Size Presets */}
              <div className="hidden sm:flex items-center gap-0.5 bg-slate-800/80 rounded-xl p-0.5 border border-slate-700/60">
                {[18, 28, 40].map(sz => (
                  <button
                    key={sz}
                    onClick={() => updateSelectedText({ fontSize: sz })}
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-black transition-all ${
                      (selectedElement.fontSize || 28) === sz
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sz === 18 ? 'ص' : sz === 28 ? 'م' : 'ك'}
                  </button>
                ))}
              </div>

              <div className="h-5 w-px bg-slate-700"></div>

              {/* Bold Toggle */}
              <button
                onClick={() => updateSelectedText({ fontWeight: selectedElement.fontWeight === 'bold' || !selectedElement.fontWeight ? 'normal' : 'bold' })}
                className={`p-1.5 rounded-xl transition-all ${
                  selectedElement.fontWeight !== 'normal'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="خط عريض (Bold)"
              >
                <Bold size={13} />
              </button>

              {/* Background Card Toggle */}
              <button
                onClick={() => updateSelectedText({ hasBackground: !selectedElement.hasBackground })}
                className={`p-1.5 rounded-xl transition-all ${
                  selectedElement.hasBackground
                    ? 'bg-indigo-600 text-white font-black shadow-sm ring-1 ring-indigo-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="خلفية بطاقة للنص (عالية الوضوح للعرض)"
              >
                <Highlighter size={13} />
              </button>

              <div className="h-5 w-px bg-slate-700"></div>

              {/* Alignment Icons */}
              <div className="flex items-center gap-0.5 bg-slate-800/80 rounded-xl p-0.5 border border-slate-700/60">
                <button
                  onClick={() => updateSelectedText({ textAlign: 'right' })}
                  className={`p-1.5 rounded-lg transition-all ${
                    selectedElement.textAlign === 'right' || !selectedElement.textAlign
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="محاذاة لليمين"
                >
                  <AlignRight size={13} />
                </button>
                <button
                  onClick={() => updateSelectedText({ textAlign: 'center' })}
                  className={`p-1.5 rounded-lg transition-all ${
                    selectedElement.textAlign === 'center'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="توسيط"
                >
                  <AlignCenter size={13} />
                </button>
                <button
                  onClick={() => updateSelectedText({ textAlign: 'left' })}
                  className={`p-1.5 rounded-lg transition-all ${
                    selectedElement.textAlign === 'left'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="محاذاة لليسار"
                >
                  <AlignLeft size={13} />
                </button>
              </div>

              <div className="h-5 w-px bg-slate-700"></div>

              {/* Quick Actions */}
              <button
                onClick={duplicateSelected}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="تكرار النص (Duplicate)"
              >
                <Copy size={13} />
              </button>
              <button
                onClick={bringToFront}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="إحضار للمقدمة"
              >
                <ArrowUp size={13} />
              </button>
              <button
                onClick={() => {
                  saveToHistory(elements.filter(el => el.id !== selectedId));
                  setSelectedId(null);
                  setEditingTextId(null);
                }}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-900/30 hover:text-rose-300"
                title="حذف النص (Delete)"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}

          {/* ═══════════ DIRECT IN-PLACE TEXT EDITING OVERLAY ═══════════ */}
          {editingTextId && (() => {
            const el = elements.find(item => item.id === editingTextId);
            if (!el) return null;
            return (
              <div
                className="absolute z-40 select-text"
                style={{
                  left: el.x,
                  top: el.y,
                  minWidth: Math.max(el.width || 280, 260),
                  maxWidth: '85%'
                }}
                onMouseDown={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
              >
                <textarea
                  ref={textInputRef}
                  value={el.text || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setElements(prev => prev.map(item => item.id === el.id ? { ...item, text: val } : item));
                    latestElementsRef.current = latestElementsRef.current.map(item => item.id === el.id ? { ...item, text: val } : item);
                  }}
                  onBlur={() => finishEditingText(el.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      finishEditingText(el.id);
                    }
                    if (e.key === 'Escape') {
                      finishEditingText(el.id);
                    }
                  }}
                  placeholder="اكتب مباشرة على السبورة هنا..."
                  dir={el.textAlign === 'left' ? 'ltr' : 'rtl'}
                  rows={Math.max(1, (el.text || '').split('\n').length)}
                  className={`w-full p-2.5 rounded-2xl outline-none transition-all resize border-2 font-['Cairo'] leading-relaxed select-text ${
                    el.hasBackground
                      ? 'bg-slate-900/95 text-white border-amber-400 shadow-2xl'
                      : 'bg-white/90 dark:bg-slate-900/90 border-dashed border-amber-400 text-slate-900 dark:text-white shadow-xl backdrop-blur-sm'
                  }`}
                  style={{
                    fontSize: `${el.fontSize || 28}px`,
                    fontWeight: el.fontWeight || 'bold',
                    textAlign: el.textAlign || 'right',
                    color: el.hasBackground && theme === 'dark' ? '#ffffff' : el.color
                  }}
                />
                <div className="flex items-center justify-between text-[10px] text-amber-400/90 mt-1 px-1 font-bold select-none">
                  <span>💡 انقر خارج المربع أو زر "تثبيت" للحفظ (Ctrl+Enter)</span>
                </div>
              </div>
            );
          })()}

          {/* ═══════════ SELECTED SHAPE DETAIL INSPECTOR & FILL COLORING ═══════════ */}
          {selectedElement && selectedElement.type !== 'text' && selectedElement.type !== 'image' && (
            <div
              className="absolute z-40 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shadow-2xl flex flex-wrap items-center gap-2 text-white text-xs animate-in zoom-in-95 duration-150 select-none"
              style={{
                top: Math.max(10, selectedElement.y - 58),
                left: Math.max(10, selectedElement.x)
              }}
              onMouseDown={e => e.preventDefault()}
            >
              {/* Fill Color Controls (تلوين داخل الشكل 🪣) */}
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700">
                <PaintBucket size={13} className="text-amber-400" />
                <span className="text-[10px] font-black text-slate-300">تعبئة:</span>
                {/* Transparent button */}
                <button
                  onClick={() => updateSelectedShape({ fill: 'transparent', fillOpacity: 0 })}
                  className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    !selectedElement.fill || selectedElement.fill === 'transparent' || selectedElement.fill === 'none'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="بدون تعبئة (شفاف)"
                >
                  شفاف
                </button>
                {/* Soft pastel matching border */}
                <button
                  onClick={() => updateSelectedShape({ fill: selectedElement.color + '33', fillOpacity: 0.35 })}
                  className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    selectedElement.fill?.endsWith('33')
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="تعبئة مائية ناعمة (Pastel 25%)"
                >
                  💧 ناعم
                </button>
                {/* Solid color swatches */}
                {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ffffff', '#0f172a'].map(fc => (
                  <button
                    key={fc}
                    onClick={() => updateSelectedShape({ fill: fc, fillOpacity: 1 })}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      selectedElement.fill === fc ? 'scale-125 border-amber-400 ring-1 ring-amber-300' : 'border-slate-600 hover:scale-110'
                    }`}
                    style={{ backgroundColor: fc }}
                    title={`تعبئة بلون ${fc}`}
                  />
                ))}
              </div>

              <div className="h-4 w-px bg-slate-700"></div>

              {/* Stroke Border Color (لون الحدود 🎨) */}
              <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700">
                <span className="text-[10px] font-black text-slate-400">الحدود:</span>
                {['#ef4444', '#f59e0b', '#22c55e', '#38bdf8', '#8b5cf6', '#ffffff'].map(sc => (
                  <button
                    key={sc}
                    onClick={() => updateSelectedShape({ color: sc })}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      selectedElement.color === sc ? 'scale-125 border-white ring-1 ring-amber-400' : 'border-slate-600 hover:scale-110'
                    }`}
                    style={{ backgroundColor: sc }}
                    title={`لون الإطار ${sc}`}
                  />
                ))}
              </div>

              <div className="h-4 w-px bg-slate-700"></div>

              {/* Stroke Width Presets (سُمك الإطار 📏) */}
              <div className="flex items-center gap-0.5 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
                {[2, 4, 8, 14].map(sw => (
                  <button
                    key={sw}
                    onClick={() => updateSelectedShape({ strokeWidth: sw })}
                    className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono font-black transition-all ${
                      selectedElement.strokeWidth === sw ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                    title={`سُمك ${sw}px`}
                  >
                    {sw}px
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-700"></div>

              {/* Border Style Toggle (مستمر / متقطع / منقط ┅) */}
              <div className="flex items-center gap-0.5 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
                {[
                  { id: 'solid', label: '───', title: 'خط مستمر' },
                  { id: 'dashed', label: '┅┅┅', title: 'خط متقطع' },
                  { id: 'dotted', label: '•••', title: 'خط منقط' },
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => updateSelectedShape({ strokeStyle: st.id as any })}
                    className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                      (selectedElement.strokeStyle || 'solid') === st.id ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                    title={st.title}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-700"></div>

              {/* Layering & Actions */}
              <button onClick={bringToFront} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="إحضار للأمام">
                <ArrowUp size={13} />
              </button>
              <button onClick={sendToBack} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="إرسال للخلف">
                <ArrowDown size={13} />
              </button>
              <button onClick={duplicateSelected} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="تكرار">
                <Copy size={13} />
              </button>
              <button
                onClick={() => {
                  saveToHistory(elements.filter(el => el.id !== selectedId));
                  setSelectedId(null);
                }}
                className="p-1 rounded-lg text-rose-400 hover:bg-rose-900/40 hover:text-rose-300"
                title="حذف"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}

          {/* The Main SVG Canvas */}
          <svg
            ref={svgRef}
            className="w-full h-full block"
            style={{ backgroundColor: bgColor }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            {/* Grid Pattern Background for Precision */}
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill={theme === 'dark' ? '#334155' : '#e2e8f0'} opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />

            {/* Render Elements in Order */}
            {elements.map(el => {
              const isSelected = el.id === selectedId;

              // 1. Freehand Stroke
              if (el.type === 'stroke' && el.points && el.points.length > 1) {
                const pathData = el.points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
                return (
                  <g key={el.id} className="cursor-move">
                    {/* Wide invisible stroke for easy grabbing */}
                    <path
                      d={pathData}
                      stroke="transparent"
                      strokeWidth={Math.max(24, el.strokeWidth + 16)}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      pointerEvents="stroke"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                    <path
                      d={pathData}
                      stroke={el.color}
                      strokeWidth={el.strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      data-element-id={el.id}
                      className="transition-opacity cursor-move"
                    />
                    {isSelected && (
                      <path
                        d={pathData}
                        stroke="#38bdf8"
                        strokeWidth={el.strokeWidth + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity="0.4"
                        pointerEvents="none"
                      />
                    )}
                  </g>
                );
              }

              // 2. Interactive Curved Arrow with Control Handles
              if (el.type === 'arrow' && el.arrowStart && el.arrowEnd) {
                const start = el.arrowStart;
                const end = el.arrowEnd;
                const ctrl = el.arrowControl || {
                  x: (start.x + end.x) / 2,
                  y: (start.y + end.y) / 2
                };

                // Calculate arrow head angle
                const angle = Math.atan2(end.y - ctrl.y, end.x - ctrl.x);
                const headLen = Math.max(12, el.strokeWidth * 3);
                const headX1 = end.x - headLen * Math.cos(angle - Math.PI / 6);
                const headY1 = end.y - headLen * Math.sin(angle - Math.PI / 6);
                const headX2 = end.x - headLen * Math.cos(angle + Math.PI / 6);
                const headY2 = end.y - headLen * Math.sin(angle + Math.PI / 6);

                return (
                  <g key={el.id} className="cursor-move">
                    {/* Wide invisible path for easy grabbing */}
                    <path
                      d={`M ${start.x},${start.y} Q ${ctrl.x},${ctrl.y} ${end.x},${end.y}`}
                      stroke="transparent"
                      strokeWidth={Math.max(26, el.strokeWidth + 18)}
                      fill="none"
                      strokeLinecap="round"
                      pointerEvents="stroke"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                    {/* Curved Path */}
                    <path
                      d={`M ${start.x},${start.y} Q ${ctrl.x},${ctrl.y} ${end.x},${end.y}`}
                      stroke={el.color}
                      strokeWidth={el.strokeWidth}
                      fill="none"
                      strokeLinecap="round"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                    {/* Arrow Head */}
                    <polygon
                      points={`${end.x},${end.y} ${headX1},${headY1} ${headX2},${headY2}`}
                      fill={el.color}
                      data-element-id={el.id}
                      className="cursor-move"
                    />

                    {/* Arrow Interactive Control Handles */}
                    {isSelected && (
                      <g>
                        {/* Connecting dotted lines between handles */}
                        <line x1={start.x} y1={start.y} x2={ctrl.x} y2={ctrl.y} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1={ctrl.x} y1={ctrl.y} x2={end.x} y2={end.y} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />

                        {/* Start Handle (Green) */}
                        <circle cx={start.x} cy={start.y} r="7" fill="#22c55e" stroke="#ffffff" strokeWidth="2" data-handle="arrow-start" cursor="move" />
                        {/* Control Curve Handle (Amber) */}
                        <circle cx={ctrl.x} cy={ctrl.y} r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" data-handle="arrow-ctrl" cursor="pointer" />
                        {/* End Handle (Red) */}
                        <circle cx={end.x} cy={end.y} r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" data-handle="arrow-end" cursor="move" />
                      </g>
                    )}
                  </g>
                );
              }

              // 3. Rich Text Element
              if (el.type === 'text') {
                if (editingTextId === el.id) return null;

                const fontSize = el.fontSize || 28;
                const lines = (el.text || '').split('\n');
                const lineCount = lines.length;
                const approxCharPerLine = Math.max(...lines.map(l => l.length), 5);
                const computedWidth = Math.max(el.width || 220, approxCharPerLine * (fontSize * 0.58) + 30);
                const computedHeight = Math.max(el.height || 50, lineCount * (fontSize * 1.35) + 20);

                const textAnchor = el.textAlign === 'center' ? 'middle' : el.textAlign === 'left' ? 'start' : 'end';
                const anchorX = el.textAlign === 'center'
                  ? el.x + computedWidth / 2
                  : el.textAlign === 'left'
                  ? el.x + 15
                  : el.x + computedWidth - 15;

                return (
                  <g
                    key={el.id}
                    className="cursor-move group"
                    data-element-id={el.id}
                    onDoubleClick={() => {
                      setEditingTextId(el.id);
                      setSelectedId(el.id);
                    }}
                  >
                    {/* Optional Card Background for High Visibility Presentation */}
                    {el.hasBackground ? (
                      <rect
                        x={el.x}
                        y={el.y}
                        width={computedWidth}
                        height={computedHeight}
                        rx={14}
                        fill={theme === 'dark' ? '#0f172ae6' : '#ffffffe6'}
                        stroke={el.color}
                        strokeWidth={2}
                        pointerEvents="all"
                        data-element-id={el.id}
                        className="cursor-move filter drop-shadow-md"
                      />
                    ) : (
                      /* Invisible hit overlay for effortless grabbing */
                      <rect
                        x={el.x}
                        y={el.y}
                        width={computedWidth}
                        height={computedHeight}
                        fill="transparent"
                        pointerEvents="all"
                        data-element-id={el.id}
                        className="cursor-move"
                      />
                    )}

                    <text
                      x={anchorX}
                      y={el.y + fontSize + 4}
                      fill={el.color}
                      fontSize={fontSize}
                      fontWeight={el.fontWeight || 'bold'}
                      fontFamily="Cairo, sans-serif"
                      textAnchor={textAnchor}
                      data-element-id={el.id}
                      className="cursor-move select-none"
                    >
                      {lines.map((line, idx) => (
                        <tspan
                          key={idx}
                          x={anchorX}
                          dy={idx === 0 ? 0 : fontSize * 1.35}
                          data-element-id={el.id}
                        >
                          {line || ' '}
                        </tspan>
                      ))}
                    </text>

                    {isSelected && (
                      <rect
                        x={el.x}
                        y={el.y}
                        width={computedWidth}
                        height={computedHeight}
                        rx={el.hasBackground ? 14 : 6}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.8"
                        strokeDasharray="5,5"
                        pointerEvents="none"
                      />
                    )}
                  </g>
                );
              }

              // 4. Image Element (from file upload)
              if (el.type === 'image' && el.src) {
                return (
                  <g key={el.id}>
                    <image
                      href={el.src}
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      preserveAspectRatio="none"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                    {isSelected && (
                      <g>
                        <rect
                          x={el.x}
                          y={el.y}
                          width={el.width}
                          height={el.height}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          pointerEvents="none"
                        />
                        {/* 4 Corner Resize Handles */}
                        <rect x={el.x - 5} y={el.y - 5} width="10" height="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" data-handle="nw" cursor="nwse-resize" />
                        <rect x={el.x + el.width - 5} y={el.y - 5} width="10" height="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" data-handle="ne" cursor="nesw-resize" />
                        <rect x={el.x - 5} y={el.y + el.height - 5} width="10" height="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" data-handle="sw" cursor="nesw-resize" />
                        <rect x={el.x + el.width - 5} y={el.y + el.height - 5} width="10" height="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" data-handle="se" cursor="nwse-resize" />
                      </g>
                    )}
                  </g>
                );
              }

              // 5. Educational Asset Element (Official Maps, Anatomy, Animals, Physics)
              if (el.type === 'asset' && el.src) {
                return (
                  <g key={el.id}>
                    <image
                      href={el.src}
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      preserveAspectRatio="none"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                    {isSelected && (
                      <g>
                        <rect
                          x={el.x}
                          y={el.y}
                          width={el.width}
                          height={el.height}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2"
                          strokeDasharray="5,4"
                          pointerEvents="none"
                        />
                        {/* 4 Corner Resize Handles */}
                        <rect x={el.x - 5} y={el.y - 5} width="10" height="10" fill="#ffffff" stroke="#d97706" strokeWidth="2" data-handle="nw" cursor="nwse-resize" />
                        <rect x={el.x + el.width - 5} y={el.y - 5} width="10" height="10" fill="#ffffff" stroke="#d97706" strokeWidth="2" data-handle="ne" cursor="nesw-resize" />
                        <rect x={el.x - 5} y={el.y + el.height - 5} width="10" height="10" fill="#ffffff" stroke="#d97706" strokeWidth="2" data-handle="sw" cursor="nesw-resize" />
                        <rect x={el.x + el.width - 5} y={el.y + el.height - 5} width="10" height="10" fill="#ffffff" stroke="#d97706" strokeWidth="2" data-handle="se" cursor="nwse-resize" />
                      </g>
                    )}
                  </g>
                );
              }

              // 6. Geometric Smart Shapes (Rectangle, Circle, Triangle, Hexagon, Cube, Star, and more)
              return (
                <g key={el.id} className="cursor-move">
                  {el.type === 'rect' && (
                    <rect
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      rx="8"
                      stroke={el.color}
                      strokeWidth={el.strokeWidth}
                      strokeDasharray={el.strokeStyle === 'dashed' ? '8,6' : el.strokeStyle === 'dotted' ? '3,4' : undefined}
                      fill={el.fill && el.fill !== 'none' ? el.fill : 'transparent'}
                      fillOpacity={el.fillOpacity}
                      pointerEvents="all"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                  )}

                  {el.type === 'circle' && (
                    <ellipse
                      cx={el.x + el.width / 2}
                      cy={el.y + el.height / 2}
                      rx={el.width / 2}
                      ry={el.height / 2}
                      stroke={el.color}
                      strokeWidth={el.strokeWidth}
                      strokeDasharray={el.strokeStyle === 'dashed' ? '8,6' : el.strokeStyle === 'dotted' ? '3,4' : undefined}
                      fill={el.fill && el.fill !== 'none' ? el.fill : 'transparent'}
                      fillOpacity={el.fillOpacity}
                      pointerEvents="all"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                  )}

                  {el.type === 'triangle' && (
                    <polygon
                      points={`${el.x + el.width / 2},${el.y} ${el.x},${el.y + el.height} ${el.x + el.width},${el.y + el.height}`}
                      stroke={el.color}
                      strokeWidth={el.strokeWidth}
                      strokeDasharray={el.strokeStyle === 'dashed' ? '8,6' : el.strokeStyle === 'dotted' ? '3,4' : undefined}
                      fill={el.fill && el.fill !== 'none' ? el.fill : 'transparent'}
                      fillOpacity={el.fillOpacity}
                      pointerEvents="all"
                      strokeLinejoin="round"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                  )}

                  {el.type === 'hexagon' && (
                    <polygon
                      points={`
                        ${el.x + el.width * 0.25},${el.y}
                        ${el.x + el.width * 0.75},${el.y}
                        ${el.x + el.width},${el.y + el.height * 0.5}
                        ${el.x + el.width * 0.75},${el.y + el.height}
                        ${el.x + el.width * 0.25},${el.y + el.height}
                        ${el.x},${el.y + el.height * 0.5}
                      `}
                      stroke={el.color}
                      strokeWidth={el.strokeWidth}
                      strokeDasharray={el.strokeStyle === 'dashed' ? '8,6' : el.strokeStyle === 'dotted' ? '3,4' : undefined}
                      fill={el.fill && el.fill !== 'none' ? el.fill : 'transparent'}
                      fillOpacity={el.fillOpacity}
                      pointerEvents="all"
                      strokeLinejoin="round"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                  )}

                  {el.type === 'cube' && (
                    <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} strokeDasharray={el.strokeStyle === 'dashed' ? '8,6' : el.strokeStyle === 'dotted' ? '3,4' : undefined} fill={el.fill && el.fill !== 'none' ? el.fill : 'none'} fillOpacity={el.fillOpacity !== undefined ? el.fillOpacity : 0.15} strokeLinejoin="round" className="cursor-move">
                      <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                      <rect x={el.x} y={el.y + el.height * 0.25} width={el.width * 0.75} height={el.height * 0.75} />
                      <rect x={el.x + el.width * 0.25} y={el.y} width={el.width * 0.75} height={el.height * 0.75} />
                      <line x1={el.x} y1={el.y + el.height * 0.25} x2={el.x + el.width * 0.25} y2={el.y} />
                      <line x1={el.x + el.width * 0.75} y1={el.y + el.height * 0.25} x2={el.x + el.width} y2={el.y} />
                      <line x1={el.x} y1={el.y + el.height} x2={el.x + el.width * 0.25} y2={el.y + el.height * 0.75} />
                      <line x1={el.x + el.width * 0.75} y1={el.y + el.height} x2={el.x + el.width} y2={el.y + el.height * 0.75} />
                    </g>
                  )}

                  {el.type === 'star' && (
                    <polygon
                      points={`
                        ${el.x + el.width * 0.5},${el.y}
                        ${el.x + el.width * 0.62},${el.y + el.height * 0.35}
                        ${el.x + el.width},${el.y + el.height * 0.38}
                        ${el.x + el.width * 0.72},${el.y + el.height * 0.62}
                        ${el.x + el.width * 0.8},${el.y + el.height}
                        ${el.x + el.width * 0.5},${el.y + el.height * 0.8}
                        ${el.x + el.width * 0.2},${el.y + el.height}
                        ${el.x + el.width * 0.28},${el.y + el.height * 0.62}
                        ${el.x},${el.y + el.height * 0.38}
                        ${el.x + el.width * 0.38},${el.y + el.height * 0.35}
                      `}
                      stroke={el.color}
                      strokeWidth={el.strokeWidth}
                      strokeDasharray={el.strokeStyle === 'dashed' ? '8,6' : el.strokeStyle === 'dotted' ? '3,4' : undefined}
                      fill={el.fill && el.fill !== 'none' ? el.fill : 'transparent'}
                      fillOpacity={el.fillOpacity}
                      pointerEvents="all"
                      strokeLinejoin="round"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                  )}

                  {/* Restored Smart Shapes */}
                  {el.type === 'parallelogram' && (
                    <polygon
                      points={`
                        ${el.x + el.width * 0.25},${el.y}
                        ${el.x + el.width},${el.y}
                        ${el.x + el.width * 0.75},${el.y + el.height}
                        ${el.x},${el.y + el.height}
                      `}
                      stroke={el.color}
                      strokeWidth={el.strokeWidth}
                      strokeDasharray={el.strokeStyle === 'dashed' ? '8,6' : el.strokeStyle === 'dotted' ? '3,4' : undefined}
                      fill={el.fill && el.fill !== 'none' ? el.fill : 'transparent'}
                      fillOpacity={el.fillOpacity}
                      pointerEvents="all"
                      strokeLinejoin="round"
                      data-element-id={el.id}
                      className="cursor-move"
                    />
                  )}

                  {el.type === 'cylinder' && (() => {
                    const ry = Math.min(el.height * 0.18, el.width * 0.2);
                    const cx = el.x + el.width / 2;
                    const rx = el.width / 2;
                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinejoin="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <ellipse cx={cx} cy={el.y + ry} rx={rx} ry={ry} />
                        <line x1={el.x} y1={el.y + ry} x2={el.x} y2={el.y + el.height - ry} />
                        <line x1={el.x + el.width} y1={el.y + ry} x2={el.x + el.width} y2={el.y + el.height - ry} />
                        <path d={`M ${el.x},${el.y + el.height - ry} A ${rx} ${ry} 0 0 0 ${el.x + el.width},${el.y + el.height - ry}`} />
                        <path d={`M ${el.x},${el.y + el.height - ry} A ${rx} ${ry} 0 0 1 ${el.x + el.width},${el.y + el.height - ry}`} strokeDasharray="4,4" opacity="0.6" />
                      </g>
                    );
                  })()}

                  {el.type === 'cone' && (() => {
                    const ry = Math.min(el.height * 0.18, el.width * 0.2);
                    const cx = el.x + el.width / 2;
                    const rx = el.width / 2;
                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinejoin="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <line x1={cx} y1={el.y} x2={el.x} y2={el.y + el.height - ry} />
                        <line x1={cx} y1={el.y} x2={el.x + el.width} y2={el.y + el.height - ry} />
                        <path d={`M ${el.x},${el.y + el.height - ry} A ${rx} ${ry} 0 0 0 ${el.x + el.width},${el.y + el.height - ry}`} />
                        <path d={`M ${el.x},${el.y + el.height - ry} A ${rx} ${ry} 0 0 1 ${el.x + el.width},${el.y + el.height - ry}`} strokeDasharray="4,4" opacity="0.6" />
                        <line x1={cx} y1={el.y} x2={cx} y2={el.y + el.height - ry} strokeDasharray="3,3" opacity="0.4" />
                      </g>
                    );
                  })()}

                  {el.type === 'axes' && (() => {
                    const cx = el.x + el.width / 2;
                    const cy = el.y + el.height / 2;
                    const arrowSize = Math.max(8, el.strokeWidth * 2.5);
                    const tickSpacing = Math.max(20, Math.min(el.width, el.height) / 8);
                    const ticksX: number[] = [];
                    for (let px = cx + tickSpacing; px < el.x + el.width - arrowSize; px += tickSpacing) {
                      ticksX.push(px);
                    }
                    for (let px = cx - tickSpacing; px > el.x + 5; px -= tickSpacing) {
                      ticksX.push(px);
                    }
                    const ticksY: number[] = [];
                    for (let py = cy + tickSpacing; py < el.y + el.height - 5; py += tickSpacing) {
                      ticksY.push(py);
                    }
                    for (let py = cy - tickSpacing; py > el.y + arrowSize; py -= tickSpacing) {
                      ticksY.push(py);
                    }

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <line x1={el.x} y1={cy} x2={el.x + el.width} y2={cy} />
                        <polygon
                          points={`
                            ${el.x + el.width},${cy}
                            ${el.x + el.width - arrowSize},${cy - arrowSize * 0.5}
                            ${el.x + el.width - arrowSize},${cy + arrowSize * 0.5}
                          `}
                          fill={el.color}
                        />
                        <line x1={cx} y1={el.y + el.height} x2={cx} y2={el.y} />
                        <polygon
                          points={`
                            ${cx},${el.y}
                            ${cx - arrowSize * 0.5},${el.y + arrowSize}
                            ${cx + arrowSize * 0.5},${el.y + arrowSize}
                          `}
                          fill={el.color}
                        />
                        {ticksX.map(px => (
                          <line key={'tx_' + px} x1={px} y1={cy - 4} x2={px} y2={cy + 4} strokeWidth={Math.max(1, el.strokeWidth * 0.7)} />
                        ))}
                        {ticksY.map(py => (
                          <line key={'ty_' + py} x1={cx - 4} y1={py} x2={cx + 4} y2={py} strokeWidth={Math.max(1, el.strokeWidth * 0.7)} />
                        ))}
                        <text x={cx - 14} y={cy + 16} fill={el.color} fontSize="14" fontWeight="bold" stroke="none">O</text>
                        <text x={el.x + el.width - 14} y={cy + 18} fill={el.color} fontSize="14" fontWeight="bold" stroke="none">x</text>
                        <text x={cx + 8} y={el.y + 16} fill={el.color} fontSize="14" fontWeight="bold" stroke="none">y</text>
                      </g>
                    );
                  })()}

                  {el.type === 'flask' && (() => {
                    const neckW = el.width * 0.28;
                    const neckH = el.height * 0.3;
                    const cx = el.x + el.width / 2;
                    const rimRy = 4;
                    const rimRx = neckW / 2 + 3;
                    const liquidY = el.y + el.height * 0.68;
                    const baseCurve = el.height * 0.08;

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinejoin="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <ellipse cx={cx} cy={el.y + rimRy} rx={rimRx} ry={rimRy} />
                        <path
                          d={`
                            M ${cx - neckW / 2},${el.y + rimRy * 2}
                            L ${cx - neckW / 2},${el.y + neckH}
                            L ${el.x + 4},${el.y + el.height - baseCurve}
                            Q ${cx},${el.y + el.height + baseCurve} ${el.x + el.width - 4},${el.y + el.height - baseCurve}
                            L ${cx + neckW / 2},${el.y + neckH}
                            L ${cx + neckW / 2},${el.y + rimRy * 2}
                          `}
                        />
                        <path
                          d={`
                            M ${el.x + el.width * 0.2},${liquidY}
                            Q ${cx},${liquidY + 4} ${el.x + el.width * 0.8},${liquidY}
                            L ${el.x + el.width - 4},${el.y + el.height - baseCurve}
                            Q ${cx},${el.y + el.height + baseCurve} ${el.x + 4},${el.y + el.height - baseCurve}
                            Z
                          `}
                          fill={el.color}
                          fillOpacity="0.15"
                          stroke={el.color}
                          strokeDasharray="4,3"
                        />
                        <line x1={cx - neckW * 0.4} y1={el.y + el.height * 0.55} x2={cx - neckW * 0.1} y2={el.y + el.height * 0.55} />
                        <line x1={cx - neckW * 0.5} y1={el.y + el.height * 0.65} x2={cx - neckW * 0.1} y2={el.y + el.height * 0.65} />
                        <line x1={cx - neckW * 0.6} y1={el.y + el.height * 0.75} x2={cx - neckW * 0.1} y2={el.y + el.height * 0.75} />
                      </g>
                    );
                  })()}

                  {el.type === 'battery' && (() => {
                    const midY = el.y + el.height / 2;
                    const cx = el.x + el.width / 2;
                    const gap = Math.max(10, el.width * 0.08);
                    const posPlateX = cx - gap;
                    const negPlateX = cx + gap;
                    const posPlateH = el.height * 0.8;
                    const negPlateH = el.height * 0.45;

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinecap="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <line x1={el.x} y1={midY} x2={posPlateX} y2={midY} />
                        <line x1={posPlateX} y1={midY - posPlateH / 2} x2={posPlateX} y2={midY + posPlateH / 2} strokeWidth={el.strokeWidth} />
                        <line x1={negPlateX} y1={midY - negPlateH / 2} x2={negPlateX} y2={midY + negPlateH / 2} strokeWidth={el.strokeWidth * 2.5} />
                        <line x1={negPlateX} y1={midY} x2={el.x + el.width} y2={midY} />
                        <text x={posPlateX - 16} y={midY - posPlateH / 2 + 10} fill={el.color} fontSize="16" fontWeight="bold" stroke="none">+</text>
                        <text x={negPlateX + 8} y={midY - negPlateH / 2 + 10} fill={el.color} fontSize="18" fontWeight="bold" stroke="none">-</text>
                      </g>
                    );
                  })()}

                  {el.type === 'resistor' && (() => {
                    const midY = el.y + el.height / 2;
                    const w = el.width;
                    const leadW = w * 0.15;
                    const bodyW = w - leadW * 2;
                    const zigH = el.height * 0.35;

                    const z1 = el.x + leadW;
                    const z2 = z1 + bodyW * (1 / 6);
                    const z3 = z1 + bodyW * (2 / 6);
                    const z4 = z1 + bodyW * (3 / 6);
                    const z5 = z1 + bodyW * (4 / 6);
                    const z6 = z1 + bodyW * (5 / 6);
                    const z7 = z1 + bodyW;

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <line x1={el.x} y1={midY} x2={z1} y2={midY} />
                        <path
                          d={`
                            M ${z1},${midY}
                            L ${z2},${midY - zigH}
                            L ${z3},${midY + zigH}
                            L ${z4},${midY - zigH}
                            L ${z5},${midY + zigH}
                            L ${z6},${midY - zigH}
                            L ${z7},${midY}
                          `}
                        />
                        <line x1={z7} y1={midY} x2={el.x + el.width} y2={midY} />
                        <text x={el.x + el.width / 2 - 6} y={midY - zigH - 4} fill={el.color} fontSize="14" fontWeight="bold" stroke="none">R</text>
                      </g>
                    );
                  })()}

                  {/* 4. Bulb (Circuit Lamp) */}
                  {el.type === 'bulb' && (() => {
                    const cx = el.x + el.width / 2;
                    const cy = el.y + el.height / 2;
                    const r = Math.min(el.width, el.height) * 0.36;
                    const d = r * 0.707;

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinecap="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <line x1={el.x} y1={cy} x2={cx - r} y2={cy} />
                        <line x1={cx + r} y1={cy} x2={el.x + el.width} y2={cy} />
                        <circle cx={cx} cy={cy} r={r} />
                        <line x1={cx - d} y1={cy - d} x2={cx + d} y2={cy + d} />
                        <line x1={cx - d} y1={cy + d} x2={cx + d} y2={cy - d} />
                      </g>
                    );
                  })()}

                  {/* 5. Switch (Circuit Key) */}
                  {el.type === 'switch' && (() => {
                    const cy = el.y + el.height * 0.6;
                    const c1x = el.x + el.width * 0.25;
                    const c2x = el.x + el.width * 0.75;
                    const leverLen = el.width * 0.48;
                    const angleRad = -0.45;
                    const lx2 = c1x + leverLen * Math.cos(angleRad);
                    const ly2 = cy + leverLen * Math.sin(angleRad);

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinecap="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <line x1={el.x} y1={cy} x2={c1x - 5} y2={cy} />
                        <circle cx={c1x} cy={cy} r={5} />
                        <line x1={c1x + 2} y1={cy - 2} x2={lx2} y2={ly2} strokeWidth={el.strokeWidth * 1.2} />
                        <circle cx={c2x} cy={cy} r={5} />
                        <line x1={c2x + 5} y1={cy} x2={el.x + el.width} y2={cy} />
                      </g>
                    );
                  })()}

                  {/* 6. Test Tube */}
                  {el.type === 'testtube' && (() => {
                    const cx = el.x + el.width / 2;
                    const tw = Math.min(el.width * 0.45, 50);
                    const r = tw / 2;
                    const topY = el.y + 8;
                    const bottomCurveY = el.y + el.height - r;
                    const liquidY = el.y + el.height * 0.62;

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinecap="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <ellipse cx={cx} cy={topY} rx={r + 3} ry={4} />
                        <path
                          d={`
                            M ${cx - r},${topY}
                            L ${cx - r},${bottomCurveY}
                            A ${r} ${r} 0 0 0 ${cx + r},${bottomCurveY}
                            L ${cx + r},${topY}
                          `}
                        />
                        <path
                          d={`
                            M ${cx - r + 1},${liquidY}
                            Q ${cx},${liquidY + 3} ${cx + r - 1},${liquidY}
                            L ${cx + r - 1},${bottomCurveY}
                            A ${r - 1} ${r - 1} 0 0 1 ${cx - r + 1},${bottomCurveY}
                            Z
                          `}
                          fill={el.color}
                          fillOpacity="0.2"
                          stroke={el.color}
                          strokeDasharray="3,2"
                        />
                        <line x1={cx - r} y1={el.y + el.height * 0.45} x2={cx - r + 7} y2={el.y + el.height * 0.45} />
                        <line x1={cx - r} y1={el.y + el.height * 0.55} x2={cx - r + 10} y2={el.y + el.height * 0.55} />
                        <line x1={cx - r} y1={el.y + el.height * 0.65} x2={cx - r + 7} y2={el.y + el.height * 0.65} />
                      </g>
                    );
                  })()}

                  {/* 7. Compass Rose (الاتجاهات الأربعة) */}
                  {el.type === 'compass' && (() => {
                    const cx = el.x + el.width / 2;
                    const cy = el.y + el.height / 2;
                    const size = Math.min(el.width, el.height) * 0.4;
                    const hub = size * 0.22;

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinejoin="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <circle cx={cx} cy={cy} r={size} strokeDasharray="3,3" opacity="0.6" />
                        <polygon points={`${cx},${cy - size} ${cx + hub},${cy - hub} ${cx},${cy} ${cx - hub},${cy - hub}`} fill={el.color} fillOpacity="0.4" />
                        <polygon points={`${cx},${cy + size} ${cx + hub},${cy + hub} ${cx},${cy} ${cx - hub},${cy + hub}`} />
                        <polygon points={`${cx + size},${cy} ${cx + hub},${cy - hub} ${cx},${cy} ${cx + hub},${cy + hub}`} />
                        <polygon points={`${cx - size},${cy} ${cx - hub},${cy - hub} ${cx},${cy} ${cx - hub},${cy + hub}`} />
                        <circle cx={cx} cy={cy} r={4} fill={el.color} />
                        <text x={cx} y={cy - size - 6} fill={el.color} fontSize="13" fontWeight="bold" textAnchor="middle" stroke="none">ش</text>
                        <text x={cx} y={cy + size + 16} fill={el.color} fontSize="13" fontWeight="bold" textAnchor="middle" stroke="none">ج</text>
                        <text x={cx + size + 10} y={cy + 5} fill={el.color} fontSize="13" fontWeight="bold" textAnchor="start" stroke="none">ق</text>
                        <text x={cx - size - 10} y={cy + 5} fill={el.color} fontSize="13" fontWeight="bold" textAnchor="end" stroke="none">غ</text>
                      </g>
                    );
                  })()}

                  {/* 8. Timeline (خط زمني للأحداث) */}
                  {el.type === 'timeline' && (() => {
                    const cy = el.y + el.height * 0.55;
                    const w = el.width;
                    const points = [0.12, 0.36, 0.62, 0.88];

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinecap="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <line x1={el.x + 8} y1={cy} x2={el.x + w - 16} y2={cy} strokeWidth={Math.max(2, el.strokeWidth * 1.4)} />
                        <polygon points={`${el.x + w - 2},${cy} ${el.x + w - 18},${cy - 8} ${el.x + w - 18},${cy + 8}`} fill={el.color} />
                        {points.map((pt, idx) => {
                          const px = el.x + w * pt;
                          return (
                            <g key={idx}>
                              <line x1={px} y1={cy - 12} x2={px} y2={cy + 12} strokeWidth={Math.max(1.5, el.strokeWidth)} />
                              <circle cx={px} cy={cy} r={5} fill={el.color} />
                              <text x={px} y={cy - 18} fill={el.color} fontSize="11" fontWeight="bold" textAnchor="middle" stroke="none">t{idx + 1}</text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}

                  {/* 9. Sticky Note (ملاحظة لاصقة) */}
                  {el.type === 'stickynote' && (() => {
                    const fold = 24;
                    const w = el.width;
                    const h = el.height;
                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} fill="none" strokeLinejoin="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={w} height={h} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <path
                          d={`
                            M ${el.x + 8},${el.y}
                            L ${el.x + w - 8},${el.y}
                            Q ${el.x + w},${el.y} ${el.x + w},${el.y + 8}
                            L ${el.x + w},${el.y + h - fold}
                            L ${el.x + w - fold},${el.y + h}
                            L ${el.x + 8},${el.y + h}
                            Q ${el.x},${el.y + h} ${el.x},${el.y + h - 8}
                            L ${el.x},${el.y + 8}
                            Q ${el.x},${el.y} ${el.x + 8},${el.y}
                            Z
                          `}
                          fill={el.fill && el.fill !== 'none' ? el.fill : (theme === 'dark' ? '#1e293b' : '#fef3c7')}
                          fillOpacity={el.fillOpacity !== undefined ? el.fillOpacity : 0.45}
                        />
                        <path
                          d={`
                            M ${el.x + w - fold},${el.y + h}
                            L ${el.x + w - fold},${el.y + h - fold}
                            L ${el.x + w},${el.y + h - fold}
                            Z
                          `}
                          fill={el.color}
                          fillOpacity="0.25"
                        />
                        <circle cx={el.x + w / 2} cy={el.y + 12} r={3.5} fill={el.color} />
                        <line x1={el.x + 14} y1={el.y + h * 0.35} x2={el.x + w - 14} y2={el.y + h * 0.35} strokeDasharray="3,3" opacity="0.4" />
                        <line x1={el.x + 14} y1={el.y + h * 0.55} x2={el.x + w - 14} y2={el.y + h * 0.55} strokeDasharray="3,3" opacity="0.4" />
                        <line x1={el.x + 14} y1={el.y + h * 0.75} x2={el.x + w - fold - 8} y2={el.y + h * 0.75} strokeDasharray="3,3" opacity="0.4" />
                      </g>
                    );
                  })()}

                  {/* 10. Speech Bubble (فقاعة حوار) */}
                  {el.type === 'speechbubble' && (() => {
                    const w = el.width;
                    const h = el.height;
                    const tailH = h * 0.22;
                    const bodyH = h - tailH;
                    const rx = 16;
                    const tailStartX = el.x + w * 0.25;

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} strokeDasharray={el.strokeStyle === 'dashed' ? '8,6' : el.strokeStyle === 'dotted' ? '3,4' : undefined} fill="none" strokeLinejoin="round" className="cursor-move">
                        <rect x={el.x} y={el.y} width={w} height={h} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <path
                          d={`
                            M ${el.x + rx},${el.y}
                            L ${el.x + w - rx},${el.y}
                            Q ${el.x + w},${el.y} ${el.x + w},${el.y + rx}
                            L ${el.x + w},${el.y + bodyH - rx}
                            Q ${el.x + w},${el.y + bodyH} ${el.x + w - rx},${el.y + bodyH}
                            L ${tailStartX + 26},${el.y + bodyH}
                            L ${tailStartX},${el.y + h}
                            L ${tailStartX + 8},${el.y + bodyH}
                            L ${el.x + rx},${el.y + bodyH}
                            Q ${el.x},${el.y + bodyH} ${el.x},${el.y + bodyH - rx}
                            L ${el.x},${el.y + rx}
                            Q ${el.x},${el.y} ${el.x + rx},${el.y}
                            Z
                          `}
                          fill={el.fill && el.fill !== 'none' ? el.fill : (theme === 'dark' ? '#0f172a' : '#ffffff')}
                          fillOpacity={el.fillOpacity !== undefined ? el.fillOpacity : 0.25}
                        />
                      </g>
                    );
                  })()}

                  {/* 11. Venn Diagram (مخطط فين للمقارنة) */}
                  {el.type === 'venn' && (() => {
                    const cx = el.x + el.width / 2;
                    const cy = el.y + el.height / 2;
                    const r = Math.min(el.width * 0.32, el.height * 0.44);
                    const offset = r * 0.58;

                    return (
                      <g data-element-id={el.id} stroke={el.color} strokeWidth={el.strokeWidth} strokeDasharray={el.strokeStyle === 'dashed' ? '8,6' : el.strokeStyle === 'dotted' ? '3,4' : undefined} fill="none" className="cursor-move">
                        <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="transparent" pointerEvents="all" data-element-id={el.id} stroke="none" className="cursor-move" />
                        <circle cx={cx - offset} cy={cy} r={r} fill={el.fill && el.fill !== 'none' ? el.fill : el.color} fillOpacity={el.fillOpacity !== undefined ? el.fillOpacity : 0.15} />
                        <circle cx={cx + offset} cy={cy} r={r} fill={el.fill && el.fill !== 'none' ? el.fill : el.color} fillOpacity={el.fillOpacity !== undefined ? el.fillOpacity : 0.15} />
                        <text x={cx - offset - r * 0.4} y={cy + 5} fill={el.color} fontSize="14" fontWeight="bold" textAnchor="middle" stroke="none">A</text>
                        <text x={cx + offset + r * 0.4} y={cy + 5} fill={el.color} fontSize="14" fontWeight="bold" textAnchor="middle" stroke="none">B</text>
                        <text x={cx} y={cy + 5} fill={el.color} fontSize="11" fontWeight="bold" textAnchor="middle" stroke="none">A ∩ B</text>
                      </g>
                    );
                  })()}

                  {/* Bounding box and resize handles when shape is selected */}
                  {isSelected && (
                    <g>
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width}
                        height={el.height}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                        pointerEvents="none"
                      />
                      <rect x={el.x - 5} y={el.y - 5} width="10" height="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" data-handle="nw" cursor="nwse-resize" />
                      <rect x={el.x + el.width - 5} y={el.y - 5} width="10" height="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" data-handle="ne" cursor="nesw-resize" />
                      <rect x={el.x - 5} y={el.y + el.height - 5} width="10" height="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" data-handle="sw" cursor="nesw-resize" />
                      <rect x={el.x + el.width - 5} y={el.y + el.height - 5} width="10" height="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" data-handle="se" cursor="nwse-resize" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Glowing Laser Pointer Effect */}
          {tool === 'laser' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {laserTrail.map((p, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-red-500"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: 6,
                    height: 6,
                    opacity: (i / laserTrail.length) * 0.4,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 8px #ef4444'
                  }}
                />
              ))}
              <div
                className="absolute"
                style={{
                  left: laserPos.x,
                  top: laserPos.y,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-7 h-7 rounded-full bg-red-500 animate-ping opacity-75 absolute -inset-0" />
                <div className="w-4 h-4 rounded-full bg-red-500 relative z-10 shadow-[0_0_15px_#ff0000]" />
              </div>
            </div>
          )}

          {/* Eraser Cursor Indicator */}
          {tool === 'eraser' && (
            <div
              className="absolute pointer-events-none rounded-full border-2 border-rose-500 bg-rose-500/20 shadow-md transition-transform"
              style={{
                width: 48,
                height: 48,
                left: eraserPos.x,
                top: eraserPos.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 50
              }}
            >
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ MODAL: EDUCATIONAL ASSETS GALLERY ═══════════ */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">مكتبة الرسوم والخرائط البيداغوجية</h3>
                  <p className="text-xs font-bold text-slate-400">انقر على أي رسم أو خريطة لإدراجها مباشرة والتحكم بها</p>
                </div>
              </div>
              <button
                onClick={() => setShowAssetModal(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 p-4 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
              {EDUCATIONAL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setAssetCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl font-black text-xs shrink-0 transition-all ${
                    assetCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Assets Grid */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {EDUCATIONAL_ASSETS
                .filter(a => assetCategory === 'all' || a.category === assetCategory)
                .map(asset => (
                  <button
                    key={asset.id}
                    onClick={() => handleAddAsset(asset)}
                    className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl transition-all flex flex-col items-center gap-3 text-center"
                  >
                    <div className="w-full h-36 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-3 overflow-hidden border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform relative">
                      <img
                        src={asset.filePath}
                        alt={asset.title}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                        {asset.badge}
                      </span>
                      <h4 className="font-black text-xs text-slate-800 dark:text-white mt-1.5 leading-snug">
                        {asset.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 line-clamp-2 leading-relaxed">
                        {asset.description}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}



      {/* ═══════════ CLASSROOM PRESENTATION OVERLAYS (Curtain, Spotlight, Timer, Wheel) ═══════════ */}
      <PresentationOverlay
        showCurtain={showCurtain}
        onCloseCurtain={() => setShowCurtain(false)}
        showSpotlight={showSpotlight}
        onCloseSpotlight={() => setShowSpotlight(false)}
        showTimer={showTimer}
        onCloseTimer={() => setShowTimer(false)}
        showPicker={showPicker}
        onClosePicker={() => setShowPicker(false)}
      />

      {/* ═══════════ LEVEL 2: PEDAGOGICAL TOOLBOX MODAL ═══════════ */}
      <WhiteboardToolboxModal
        isOpen={showToolboxModal}
        onClose={() => setShowToolboxModal(false)}
        onInsertElement={handleInsertFromToolbox}
        onOpenCurtain={() => setShowCurtain(true)}
        onOpenSpotlight={() => setShowSpotlight(true)}
        onOpenTimer={() => setShowTimer(true)}
        onOpenPicker={() => setShowPicker(true)}
      />

      {/* ═══════════ LEVEL 3: PRE-ENGINEERED LESSON KITS MODAL ═══════════ */}
      <LessonKitGeneratorModal
        isOpen={showLessonKitModal}
        onClose={() => setShowLessonKitModal(false)}
        onApplyKit={handleApplyLessonKit}
      />

      {/* ═══════════ SAVED BOARDS & TEACHER LIBRARY MODAL ═══════════ */}
      <SavedBoardsModal
        isOpen={showSavedBoardsModal}
        onClose={() => setShowSavedBoardsModal(false)}
        currentPages={pages.map((p, idx) => idx === currentPageIdx ? elements : p)}
        onLoadBoard={handleLoadSavedBoard}
      />

      {/* ═══════════ FLOATING DRAGGABLE CALCULATOR ═══════════ */}
      {showCalculator && <DraggableCalculator onClose={() => setShowCalculator(false)} />}
    </div>
  );
}
