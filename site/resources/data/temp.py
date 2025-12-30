
import os
import json
import unicodedata

path = "/Users/arthur/Desktop/__Site/Arthurmgnr.github.io/site/resources/data/games/"

files_to_load = [
    "owned_games_low.json",
    # "wanted_games_low.json"
]

# l_images = [elt for elt in os.listdir(path) if elt != ".DS_Store"]

data = []
for file_path in files_to_load:
    full_path = path + file_path
    with open(full_path, "r", encoding="utf-8") as f:
        data.extend(json.load(f))

print(f"Nombre de jeux = {len(data)}")
print(f"Prix total = {sum(float(elt['prix'].replace(',', '.')) for elt in data):.2f}")


# Prix
l = []
for elt in data:
    c = float(elt["prix"].replace(",", "."))
    if c not in l:
        l.append(c)
l.sort()
print()
print("Prix")
print(f"Min = {min(l)} ; Max = {max(l)}")


# Age
l = []
for elt in data:
    c = int(elt["age"])
    if c not in l:
        l.append(c)
l.sort()
print()
print("Age")
print(l)


# Nb joueurs
l = []
for elt in data:
    c = elt["nbJoueurs"]
    if c not in l:
        l.append(c)
l.sort()
print()
print("nbJoueurs")
print(l)


# Duree
l = []
for elt in data:
    c = int(elt["duree"])
    if c not in l:
        l.append(c)
l.sort()
print()
print("Duree")
print(l)


# Editeur
l = []
for elt in data:
    c = elt["editeur"]
    if c not in l:
        l.append(c)
l.sort()
print()
print("Editeurs")
print(l)


# Categories
l = []
for elt in data:
    c = elt["categories"]
    for cat in c:
        if cat not in l:
            l.append(cat)
l.sort()
print()
print("Categories")
print(l)

