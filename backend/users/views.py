from rest_framework import generics, mixins
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        login = request.data.get('login')
        if User.objects.filter(login=login).exists():
            return Response({'error': 'Login już istnieje'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        login = request.data.get('login')
        password = request.data.get('password')

        if not login or not password:
            return Response({'error': 'Email i hasło są wymagane'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(login=login)
        except User.DoesNotExist:
            return Response({'error': 'Email jest niepoprawny lub nie jest zarejestrowany'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            return Response({'error': 'Hasło jest nieprawidłowe'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=login, password=password)
        if user is None:
            return Response({'error': 'Wystąpił błąd podczas logowania'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class UserListView(generics.ListCreateAPIView, generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'

class UserMeView(mixins.UpdateModelMixin, generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ChangePasswordView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({"error": "Stare i nowe hasło są wymagane"}, status=status.HTTP_400_BAD_REQUEST)

        if old_password == new_password:
            return Response({"error": "Nowe hasło nie może być takie samo jak stare hasło"}, status=status.HTTP_400_BAD_REQUEST)

        if not check_password(old_password, user.password):
            return Response({"error": "Stare hasło jest nieprawidłowe"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"success": "Hasło zostało zmienione"}, status=status.HTTP_200_OK)