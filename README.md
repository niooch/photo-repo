# Aplikacja webowa do przeglądania i zarządzania zdjęciami użytkowników

## Spis treści
- [Opis i cel projektu](#opis-i-cel-projektu)
- [Rodzaje użytkowników](#rodzaje-użytkowników)
- [Wymagania funkcjonalne](#wymagania-funkcjonalne)
- [Użyte technologie](#użyte-technologie)
- [Model bazy danych](#model-bazy-danych)
- [Diagram ERD](#diagram-erd)
- [Bezpieczeństwo i uprawnienia](#bezpieczeństwo-i-uprawnienia)
- [Instalacja](#instalacja)
- [Autor](#autor)

## Opis i cel projektu
Aplikacja umożliwia użytkownikom przeglądanie i zarządzanie zdjęciami poprzez interfejs webowy. Użytkownicy mogą:
- Dodawać zdjęcia
- Przeglądać zdjęcia innych użytkowników
- Dodawać komentarze
- Organizować zdjęcia w albumy

Aplikacja korzysta z bazy danych do przechowywania informacji o użytkownikach, zdjęciach, komentarzach oraz albumach.

## Rodzaje użytkowników
### Administrator (Admin):
- Zarządza użytkownikami (dodawanie, usuwanie, edycja)
- Ma pełne prawa do bazy danych
- Może konfigurować aplikację

### Użytkownik (User):
- Może dodawać i usuwać własne zdjęcia
- Może przeglądać zdjęcia innych użytkowników (jeżeli są udostępnione)
- Może dodawać komentarze

## Wymagania funkcjonalne
### Administrator:
1. Tworzenie, edycja, usuwanie użytkowników
2. Przeprowadzanie backupów bazy danych
3. Zarządzanie ustawieniami aplikacji

### Użytkownik:
1. Rejestracja, logowanie, wylogowanie
2. Dodawanie zdjęć
3. Usuwanie zdjęć
4. Edycja metadanych zdjęć (tytuł, opis, tagi)
5. Przeglądanie zdjęć swoich oraz innych użytkowników

## Użyte technologie
- **Frontend:** HTML, CSS, JavaScript, React.js
- **Backend:** Node.js, Express.js
- **Baza Danych:** MySQL
- **Komunikacja:** Axios

## Model bazy danych
### Encje:
- **User**: informacje o użytkownikach
- **Device**: urządzenia używane do robienia zdjęć
- **Photo**: metadane zdjęć i ścieżki plików
- **Tag**: kategorie przypisane do zdjęć
- **PhotoTag**: tabela łącząca zdjęcia i tagi
- **Album**: grupowanie zdjęć
- **AlbumPhoto**: relacja między albumami a zdjęciami

## Diagram ERD
Diagram przedstawiający model bazy danych dostępny w pliku `erd.jpg`.

## Bezpieczeństwo i uprawnienia
### Administrator:
- Pełne prawa do wszystkich tabel
- Zarządzanie użytkownikami

### Użytkownik:
- Może zarządzać własnymi zdjęciami i albumami
- Brak dostępu do tabel systemowych

## Instalacja
1. **Klonowanie repozytorium:**
   ```bash
   git clone https://github.com/username/repository.git
   cd repository
   ```
2. **Instalacja zależności:**
   ```bash
   npm install
   ```
3. **Konfiguracja bazy danych:**
   - Utwórz bazę danych w MySQL
   - Zaimportuj plik `schema.sql`
4. **Uruchomienie aplikacji:**
   ```bash
   npm start
   ```

## Autor
**Jakub Kogut**
