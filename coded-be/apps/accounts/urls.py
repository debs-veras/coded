from django.urls import path
from .views import (
    CustomTokenObtainPairView, 
    CustomTokenRefreshView, 
    VerifyUserView, 
    LogoutView
)

urlpatterns = [
    path('login', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('token/refresh', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('verify', VerifyUserView.as_view(), name='token_verify'),
]
