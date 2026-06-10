import os
import fitz  # PyMuPDF
from supabase import create_client, Client
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv(".env.local")

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") # Usar service role para bypass RLS

if not url or not key:
    print("Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados em .env.local")
    exit(1)

supabase: Client = create_client(url, key)

pdf_path = r"C:\Users\Djktita\Downloads\Catálogo Digital AGP 2026.pdf"
output_dir = "public/products/extracted"
os.makedirs(output_dir, exist_ok=True)

print(f"Extraindo imagens do PDF: {pdf_path}")
doc = fitz.open(pdf_path)

# Extrair imagens (apenas as grandes, ignorando logos pequenas)
image_counter = 1
extracted_images = []

for i in range(len(doc)):
    page = doc[i]
    images = page.get_images()
    for img in images:
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        # Filtrar imagens muito pequenas (geralmente ícones/logos)
        if len(image_bytes) > 20000: # Maior que 20KB
            filename = f"img_{image_counter}.{image_ext}"
            filepath = os.path.join(output_dir, filename)
            with open(filepath, "wb") as f:
                f.write(image_bytes)
            extracted_images.append(f"/products/extracted/{filename}")
            image_counter += 1

print(f"{len(extracted_images)} imagens extraídas com sucesso!")

# Dados do catálogo extraídos via OCR
produtos = [
    {
        "name": "ANESTT 50ml",
        "category": "ANESTÉSICOS",
        "description": "Anestésico local injetável à base de Cloridrato de Lidocaína 2% e Bitartarato de Epinefrina. Atua no bloqueio e na condução nervosa, provocando vasoconstrição.",
        "price": 35.90,
        "active": True
    },
    {
        "name": "APROMAZIN 1% INJETÁVEL",
        "category": "ANESTÉSICOS",
        "description": "Tranquilizante e pré-anestésico à base de Maleato de Acepromazina. Ideal para tranquilização de equinos durante exames e procedimentos.",
        "price": 85.00,
        "active": True
    },
    {
        "name": "CETAMIN",
        "category": "ANESTÉSICOS",
        "description": "Anestésico geral dissociativo à base de Cloridrato de Cetamina 10%. Rápido início de ação, induzindo o animal à amnésia e catalepsia.",
        "price": 120.00,
        "active": True
    },
    {
        "name": "DETOMIDIN",
        "category": "ANESTÉSICOS",
        "description": "Analgésico, sedativo e pré-anestésico à base de Detomidina 1%, indicado para contenção animal e analgesia.",
        "price": 140.00,
        "active": True
    },
    {
        "name": "ISOFLURANO SYNTEC",
        "category": "ANESTÉSICOS",
        "description": "Único anestésico inalatório veterinário disponível no mercado brasileiro, indicado para indução e manutenção de anestesia geral.",
        "price": 300.00,
        "active": True
    },
    {
        "name": "DICLOFENACO SYNTEC",
        "category": "ANTI-INFLAMATÓRIOS",
        "description": "Anti-inflamatório não esteroide à base de Diclofenaco Sódico. Possui potente atividade analgésica e antipirética.",
        "price": 45.00,
        "active": True
    },
    {
        "name": "FARMADEX INJETÁVEL",
        "category": "ANTI-INFLAMATÓRIOS",
        "description": "Anti-inflamatório esteroide (AIE) indicado para o alívio da dor e combate a diversos tipos de inflamações (artrites, bursites, sinusites).",
        "price": 60.00,
        "active": True
    },
    {
        "name": "FENILBUTAZONA SYNTEC",
        "category": "ANTI-INFLAMATÓRIOS",
        "description": "AINE com propriedades analgésica e antipirética. Inibe a síntese de prostaglandinas. Tratamento de inflamação e febre.",
        "price": 75.00,
        "active": True
    },
    {
        "name": "MAXITEC INJETÁVEL",
        "category": "ANTI-INFLAMATÓRIOS",
        "description": "Anti-inflamatório não esteroide à base de Meloxicam 3%. Inibidor seletivo da ciclo-oxigenase com propriedades antipirética e analgésica.",
        "price": 95.00,
        "active": True
    },
    {
        "name": "FLOBIOTIC 10%",
        "category": "ANTIBIÓTICOS",
        "description": "Antibiótico injetável de amplo espectro à base de Enrofloxacino 10%. Para infecções respiratórias, gastrointestinais e geniturinárias.",
        "price": 80.00,
        "active": True
    },
    {
        "name": "GENTOMICIN",
        "category": "ANTIBIÓTICOS",
        "description": "Antibiótico bactericida à base de Sulfato de Gentamicina 4%. Ação contra Gram-negativos e alguns Gram-positivos.",
        "price": 55.00,
        "active": True
    },
    {
        "name": "PROPEN",
        "category": "ANTIBIÓTICOS",
        "description": "Bactericida à base de Benzilpenicilina Procaína e Potássica associadas ao Probenicide.",
        "price": 110.00,
        "active": True
    },
    {
        "name": "SULFATROX",
        "category": "ANTIBIÓTICOS",
        "description": "Antibiótico injetável que combina Sulfadiazina com Trimetoprima. Ação sinérgica bactericida.",
        "price": 65.00,
        "active": True
    }
]

print("Populando banco de dados no Supabase...")

# Limpar produtos existentes (opcional)
supabase.table("products").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

# Inserir produtos com imagens
for i, prod in enumerate(produtos):
    # Atribuir imagem sequencialmente (repetir se faltar imagem)
    img_url = extracted_images[i % len(extracted_images)] if extracted_images else "https://via.placeholder.com/300x300?text=Sem+Imagem"
    prod["image_url"] = img_url
    
    res = supabase.table("products").insert(prod).execute()
    print(f"Inserido: {prod['name']}")

print("Carga de dados concluída com sucesso!")
