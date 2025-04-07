# 🎬 Morfilm
Morfilm és una aplicació mòbil desenvolupada amb React Native dissenyada seguint les directrius de Material Design 3, i combina contingut en temps real obtingut de l'API de The Movie Database (TMDb) amb funcionalitats pròpies (inici de sessió i llistes) amb base de dades pròpia a Supabase.

## 📱 Funcionalitats
- 🔐 Login i registre d’usuari
- 🏠 Pantalla inicial amb seccions (pel·lícules i tràilers populars, trending, etc)
- 🎬 Detall de cada pel·lícula amb accions (afegir a llistes) i informació general
- 📂 Gestió de llistes personalitzades de pel·lícules
- 👥 Perfil d’usuari (visualització i administració de les llistes)
- ⚙️ Configuració (light/dark mode, log out)

## 🗄️ Estructura
morfilm/
│
├── assets/                        # Imatges, icones,etc.
├── components/                    # Components reutilitzables
├── screens/                       # Totes les pantalles
├── App.js                         # Arrel del projecte
└── morfilm-material-theme.json    # Paleta de colors i tipografies (Material Theme propi)
