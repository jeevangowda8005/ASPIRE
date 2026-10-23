def generate_summary(c, category, drivers):
    load_phrase = {"Low": "a light stress load", "Moderate": "a moderate stress load",
                   "High": "a heavy stress load", "Critical": "an overwhelming stress load"}[category]
    deadline_phrase = ""
    if c.deadlines_count > 0:
        plural = "s" if c.deadlines_count != 1 else ""
        deadline_phrase = f" with {c.deadlines_count} deadline{plural} ahead"
    anxiety_phrase = ""
    if c.anxiety_level >= 7:
        anxiety_phrase = " and anxiety running high"
    elif c.anxiety_level >= 5:
        anxiety_phrase = " and some anxiety creeping in"
    parts = [f"You're navigating {load_phrase}{deadline_phrase}{anxiety_phrase}."]
    if c.sleep_hours >= 7 and c.sleep_quality >= 7:
        parts.append(f"Your sleep foundation looks solid at {c.sleep_hours:.0f} hours with good quality.")
    elif c.sleep_hours >= 6.5:
        parts.append(f"Your sleep foundation is solid at {c.sleep_hours:.0f} hours, but quality and concentration could use a boost.")
    else:
        parts.append(f"At {c.sleep_hours:.0f} hours, sleep is likely your biggest lever for relief right now.")
    strengths = []
    if c.social_support >= 6: strengths.append("decent social support")
    if c.physical_activity_days >= 3: strengths.append("staying somewhat active")
    if c.self_esteem >= 7: strengths.append("strong self-confidence")
    if strengths:
        st = " and ".join(strengths) if len(strengths) <= 2 else ", ".join(strengths[:-1]) + f", and {strengths[-1]}"
        parts.append(f"The good news? You've got {st} — let's build on these strengths.")
    else:
        parts.append("Let's focus on a couple of small wins to build momentum this week.")
    return " ".join(parts)
