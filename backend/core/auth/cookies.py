from fastapi import Response


def set_auth_cookies(
    response: Response,
    access_token: str,
    refresh_token: str,
    access_expires_minutes: int,
    refresh_expires_minutes: int,
    httponly: bool = True,
    secure: bool = True,
    samesite: str = "lax",
):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=httponly,
        max_age=access_expires_minutes,
        secure=secure,
        samesite=samesite,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=httponly,
        max_age=refresh_expires_minutes,
        secure=secure,
        samesite=samesite,
    )
