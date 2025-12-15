@echo off
chcp 65001 >nul
title Abrir Carpeta de Imágenes de Expositores

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   ABRIENDO CARPETA DE IMÁGENES DE EXPOSITORES        ║
echo ╚══════════════════════════════════════════════════════╝
echo.

REM Abrir la carpeta directamente
start "" "%~dp0images\expositores"

echo ✓ Carpeta abierta
echo.
echo Ubicación: %~dp0images\expositores
echo.
timeout /t 2 >nul

