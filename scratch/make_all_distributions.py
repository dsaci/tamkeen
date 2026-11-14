# -*- coding: utf-8 -*-
import json
import os

def w(weekNumber, monthNameAr, unitNumber, unitTitle, theme, literaryText, grammar, rhetoric, reading, writing, hours, isExam=False, isHoliday=False, holidayName="", notes=""):
    return {
        "weekNumber": weekNumber,
        "monthNameAr": monthNameAr,
        "unitNumber": unitNumber,
        "unitTitle": unitTitle,
        "theme": theme,
        "literaryText": literaryText,
        "grammar": grammar,
        "rhetoricOrProsody": rhetoric,
        "guidedReadingOrCommunicative": reading,
        "writingOrIntegration": writing,
        "hours": hours,
        "isExamPeriod": isExam,
        "isHoliday": isHoliday,
        "holidayName": holidayName,
        "notes": notes
    }

def makeMonth(m_id, monthNameAr, monthIndex, semester, weeks, isExamPeriod=False, examTitle=None):
    literature = []
    grammar = []
    rhetoric = []
    writing = []

    for wk in weeks:
        if wk["literaryText"] and wk["literaryText"] not in literature:
            literature.append(wk["literaryText"])
        if wk["grammar"] and wk["grammar"] not in grammar:
            grammar.append(wk["grammar"])
        if wk["rhetoricOrProsody"] and wk["rhetoricOrProsody"] not in rhetoric:
            rhetoric.append(wk["rhetoricOrProsody"])
        if wk["writingOrIntegration"] and wk["writingOrIntegration"] not in writing:
            writing.append(wk["writingOrIntegration"])

    res = {
        "id": m_id,
        "monthNameAr": monthNameAr,
        "monthIndex": monthIndex,
        "semester": semester,
        "weeksCount": len(weeks),
        "isExamPeriod": isExamPeriod,
        "weeks": weeks,
        "branchSummary": {
            "literature": literature,
            "grammar": grammar,
            "rhetoric": rhetoric,
            "writing": writing
        }
    }
    if examTitle:
        res["examTitle"] = examTitle
    return res

print("Python distribution generator module ready.")
