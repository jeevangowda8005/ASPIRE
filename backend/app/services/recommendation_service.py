_LIBRARY = {
    "SLEEP": {
        "title": "Upgrade Your Sleep Architecture",
        "category": "SLEEP",
        "trigger": lambda c: c.sleep_quality <= 6 or c.sleep_hours < 7,
        "severity": lambda c: (10 - c.sleep_quality) + max(0, 7 - c.sleep_hours) * 1.5,
        "description": "You're not getting fully restorative sleep. Small tweaks to your sleep environment and wind-down routine can dramatically improve how you feel.",
        "action_items": [
            "Set a screen curfew 30 minutes before bed — switch to reading or journaling",
            "Keep your room cool and pitch dark with blackout solutions",
            "Try a 10-minute body scan meditation using a free app like Insight Timer",
            "Track one week of sleep quality changes in your phone's notes",
        ],
    },
    "TIME MANAGEMENT": {
        "title": "Break Down Your Deadline Storm",
        "category": "TIME MANAGEMENT",
        "trigger": lambda c: c.deadlines_count >= 2 or c.workload_intensity >= 6,
        "severity": lambda c: c.deadlines_count * 1.2 + c.workload_intensity,
        "description": "Multiple deadlines feel overwhelming when viewed as one monolith. Breaking them into micro-tasks reduces cognitive load and builds momentum.",
        "action_items": [
            "List all deadlines and reverse-engineer each into 3-5 concrete tasks",
            "Block 90-minute focus sessions in your calendar for high-priority items",
            "Use the 2-minute rule: if a task takes less than 2 minutes, do it immediately",
            "Review your task list each evening and identify tomorrow's top 3 priorities",
        ],
    },
    "MINDFULNESS": {
        "title": "Calm Your Nervous System Daily",
        "category": "MINDFULNESS",
        "trigger": lambda c: c.anxiety_level >= 5,
        "severity": lambda c: c.anxiety_level * 1.3,
        "description": "With anxiety creeping up, building a consistent grounding practice helps regulate your stress response before it escalates.",
        "action_items": [
            "Practice 4-7-8 breathing twice daily: inhale 4 counts, hold 7, exhale 8",
            "Download Headspace or Calm and commit to 5 minutes each morning",
            "Create an anxiety dump document where you brain-dump worries for 5 minutes",
            "Notice physical anxiety signals (tight chest, racing thoughts) and name them aloud",
        ],
    },
    "MOVEMENT": {
        "title": "Move Your Body, Clear Your Mind",
        "category": "MOVEMENT",
        "trigger": lambda c: c.physical_activity_days <= 3,
        "severity": lambda c: max(0, 4 - c.physical_activity_days) * 1.5,
        "description": "Bumping up your active days unlocks serious stress-relief benefits and sharpens concentration when you need it most.",
        "action_items": [
            "Add one 20-minute walk between study sessions this week",
            "Try a 15-minute YouTube yoga flow specifically for stress relief",
            "Schedule movement as non-negotiable appointments in your calendar",
            "Recruit a friend for accountability — social + movement is a power combo",
        ],
    },
    "ACADEMIC": {
        "title": "Sharpen Your Focus Toolkit",
        "category": "ACADEMIC",
        "trigger": lambda c: c.focus_ability <= 6,
        "severity": lambda c: (10 - c.focus_ability) * 1.1,
        "description": "Mid-level concentration during high workload means you're working harder, not smarter. Evidence-based focus strategies help you accomplish more in less time.",
        "action_items": [
            "Use the Pomodoro Technique: 25 minutes focused work, 5-minute break",
            "Identify your peak energy hours and protect them for hardest cognitive tasks",
            "Eliminate digital distractions with apps like Forest or Freedom during study blocks",
            "Start each study session by writing down exactly what done looks like",
        ],
    },
    "SOCIAL": {
        "title": "Activate Your Support Network",
        "category": "SOCIAL",
        "trigger": lambda c: True,
        "severity": lambda c: max(0, 7 - c.social_support) * 1.2,
        "description": "Connection is one of the most powerful buffers against academic stress and anxiety — leverage your support network strategically.",
        "action_items": [
            "Schedule one 30-minute coffee chat or walk with a friend this week",
            "Join or create a study group for your toughest class",
            "Share one specific stressor with someone you trust and ask for their perspective",
            "Attend one campus event or club meeting to expand your network",
        ],
    },
}

def _priority_label(score):
    if score >= 8: return "HIGH"
    elif score >= 4: return "MEDIUM"
    return "LOW"

def generate_recommendations(c, max_cards=6):
    candidates = []
    for key, rec in _LIBRARY.items():
        if rec["trigger"](c):
            severity = rec["severity"](c)
            candidates.append({
                "priority": _priority_label(severity),
                "category": rec["category"],
                "title": rec["title"],
                "description": rec["description"],
                "action_items": rec["action_items"],
                "_severity": severity,
            })
    if len(candidates) < 4:
        rec = _LIBRARY["SOCIAL"]
        if "SOCIAL" not in [c_["category"] for c_ in candidates]:
            candidates.append({
                "priority": _priority_label(rec["severity"](c)),
                "category": rec["category"],
                "title": rec["title"],
                "description": rec["description"],
                "action_items": rec["action_items"],
                "_severity": rec["severity"](c),
            })
    candidates.sort(key=lambda x: x["_severity"], reverse=True)
    top = candidates[:max_cards]
    for item in top:
        item.pop("_severity", None)
    return top
