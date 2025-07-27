import jdatetime

def to_jalali_str(dt):
    if not dt:
        return ""
    jalali = jdatetime.datetime.fromgregorian(datetime=dt)
    months = [
        "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ]
    return f"{jalali.day} {months[jalali.month - 1]} {jalali.year}"


def get_jalali_month_year(dt):
    jalali = jdatetime.datetime.fromgregorian(datetime=dt)
    months = [
        "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ]
    return f"{months[jalali.month - 1]} {jalali.year}"
