@echo off
echo Running medical records cleanup script at %date% %time%
cd /d C:\project\kist_poly_clinic\kist
call C:\project\kist_poly_clinic\venv\Scripts\activate.bat
python manage.py delete_old_medical_records
echo Cleanup completed at %date% %time%
