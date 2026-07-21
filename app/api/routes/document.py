import uuid
from pathlib import Path
from typing import List

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse

from app.core.deps import SessionDep, CurrentUser
from app.core.storage import UPLOAD_DIR, MAX_FILE_SIZE, ALLOWED_MIME_TYPES
from app.models.Document import Document
from app.models.Dossier import Dossier
from app.schemas.document import DocumentRead

router = APIRouter()

def _get_dossier_or_404(dossier_id: int, db: SessionDep):
    dossier = db.query(Dossier).filter(Dossier.id == dossier_id).first()
    if not dossier:
        raise HTTPException(status_code=404, detail="Dossier non trouvé")
    return dossier

def _generate_unique_filename(original_filename: str) -> str:
    ext = Path(original_filename).suffix
    return f"{uuid.uuid4()}{ext}"

@router.post("/dossiers/{dossier_id}/documents", status_code=201)
async def upload_document(
    dossier_id: int,
    db: SessionDep,
    current_user: CurrentUser,
    fichier: UploadFile = File(...),
    description: str = Form(""),
    confidentiel: bool = Form(False),
):
    _get_dossier_or_404(dossier_id, db)
    
    if fichier.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(400, "Type de fichier non supporté")
    
    content = await fichier.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, "Fichier trop volumineux (max 10 Mo)")
    
    unique_filename = _generate_unique_filename(fichier.filename)
    dossier_upload_path = UPLOAD_DIR / str(dossier_id)
    dossier_upload_path.mkdir(parents=True, exist_ok=True)
    file_path = dossier_upload_path / unique_filename
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    document = Document(
        dossier_id=dossier_id,
        uploaded_by_id=current_user.id,
        nom_fichier=fichier.filename,
        chemin_stockage=str(file_path),
        type_mime=fichier.content_type,
        taille_octets=len(content),
        description=description,
        confidentiel=confidentiel,
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    url_acces = f"/uploads/dossiers/{dossier_id}/{unique_filename}"
    
    return DocumentRead(
        id=document.id,
        dossier_id=document.dossier_id,
        uploaded_by_id=document.uploaded_by_id,
        nom_fichier=document.nom_fichier,
        chemin_stockage=document.chemin_stockage,
        type_mime=document.type_mime,
        taille_octets=document.taille_octets,
        description=document.description,
        confidentiel=document.confidentiel,
        url_acces=url_acces,
        created_at=document.created_at,
    )

@router.get("/dossiers/{dossier_id}/documents")
def list_documents(dossier_id: int, db: SessionDep, current_user: CurrentUser):
    _get_dossier_or_404(dossier_id, db)
    documents = db.query(Document).filter(Document.dossier_id == dossier_id).all()
    
    result = []
    for doc in documents:
        file_name = Path(doc.chemin_stockage).name
        url_acces = f"/uploads/dossiers/{dossier_id}/{file_name}"
        result.append(DocumentRead(
            id=doc.id,
            dossier_id=doc.dossier_id,
            uploaded_by_id=doc.uploaded_by_id,
            nom_fichier=doc.nom_fichier,
            chemin_stockage=doc.chemin_stockage,
            type_mime=doc.type_mime,
            taille_octets=doc.taille_octets,
            description=doc.description,
            confidentiel=doc.confidentiel,
            url_acces=url_acces,
            created_at=doc.created_at,
        ))
    return result

@router.get("/documents/{doc_id}")
def get_document_metadata(doc_id: int, db: SessionDep, current_user: CurrentUser):
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(404, "Document non trouvé")
    
    file_name = Path(document.chemin_stockage).name
    url_acces = f"/uploads/dossiers/{document.dossier_id}/{file_name}"
    
    return DocumentRead(
        id=document.id,
        dossier_id=document.dossier_id,
        uploaded_by_id=document.uploaded_by_id,
        nom_fichier=document.nom_fichier,
        chemin_stockage=document.chemin_stockage,
        type_mime=document.type_mime,
        taille_octets=document.taille_octets,
        description=document.description,
        confidentiel=document.confidentiel,
        url_acces=url_acces,
        created_at=document.created_at,
    )

@router.get("/documents/{doc_id}/fichier")
def download_file(doc_id: int, db: SessionDep, current_user: CurrentUser):
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(404, "Document non trouvé")
    
    file_path = Path(document.chemin_stockage)
    if not file_path.exists():
        raise HTTPException(404, "Fichier physique non trouvé")
    
    return FileResponse(
        path=file_path,
        filename=document.nom_fichier,
        media_type=document.type_mime or "application/octet-stream",
    )