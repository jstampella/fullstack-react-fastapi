def safe_int(value, default):
    try:
        return int(value)
    except (ValueError, TypeError):
        return default
