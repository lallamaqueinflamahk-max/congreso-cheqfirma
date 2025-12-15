' Script VBS para abrir Outlook directamente con el correo
' Congreso CheqFirma

Set fso = CreateObject("Scripting.FileSystemObject")
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)

' Buscar el archivo ZIP más reciente
Set folder = fso.GetFolder(scriptPath)
Set files = folder.Files
latestZip = ""
latestDate = #1/1/1900#

For Each file In files
    If LCase(Right(file.Name, 4)) = ".zip" And InStr(file.Name, "Carpetas_Marketing_Presupuesto_") > 0 Then
        If file.DateLastModified > latestDate Then
            latestDate = file.DateLastModified
            latestZip = file.Path
        End If
    End If
Next

If latestZip = "" Then
    MsgBox "No se encontró el archivo ZIP. Por favor, ejecuta primero el script PowerShell.", vbCritical, "Error"
    WScript.Quit
End If

' Configuración del correo
destinatario = "Lallamaqueinflamahk@gmail.com"
asunto = "Carpetas de Marketing y Presupuesto - Congreso CheqFirma"
mensaje = "Hola," & vbCrLf & vbCrLf & _
          "Te envío las carpetas preparadas con los contenidos de marketing y pautaje, así como el presupuesto de $50 USD para 48 horas que solicitaste." & vbCrLf & vbCrLf & _
          "📁 CARPETAS INCLUIDAS:" & vbCrLf & vbCrLf & _
          "1. MARKETING_Y_PAUTAJE" & vbCrLf & _
          "   - Plan completo de marketing para Paraguay" & vbCrLf & _
          "   - Contenidos listos para usar (posts, stories, carousels)" & vbCrLf & _
          "   - Estrategia multi-país" & vbCrLf & _
          "   - Ejemplos de anuncios completos" & vbCrLf & _
          "   - Creativos y copies" & vbCrLf & vbCrLf & _
          "2. PRESUPUESTO_50USD_48HORAS" & vbCrLf & _
          "   - Estrategia ultra-optimizada para $50 USD" & vbCrLf & _
          "   - Distribución del presupuesto por día y hora" & vbCrLf & _
          "   - Creativos listos para usar" & vbCrLf & _
          "   - Métricas y resultados esperados" & vbCrLf & vbCrLf & _
          "Cada carpeta incluye un archivo README.md con instrucciones detalladas de uso." & vbCrLf & vbCrLf & _
          "Si tienes alguna pregunta o necesitas ajustes, no dudes en contactarme." & vbCrLf & vbCrLf & _
          "Saludos," & vbCrLf & _
          "Equipo CheqFirma"

' Intentar abrir Outlook
On Error Resume Next
Set objOutlook = CreateObject("Outlook.Application")
If Err.Number <> 0 Then
    ' Si Outlook no está disponible, usar mailto: Y abrir carpeta
    mensajeEncoded = Replace(mensaje, " ", "%20")
    mensajeEncoded = Replace(mensajeEncoded, vbCrLf, "%0D%0A")
    asuntoEncoded = Replace(asunto, " ", "%20")
    mailtoLink = "mailto:" & destinatario & "?subject=" & asuntoEncoded & "&body=" & mensajeEncoded
    CreateObject("WScript.Shell").Run mailtoLink
    
    ' Abrir la carpeta donde está el ZIP para que pueda arrastrarlo
    CreateObject("WScript.Shell").Run "explorer.exe /select," & Chr(34) & latestZip & Chr(34)
    
    MsgBox "IMPORTANTE:" & vbCrLf & vbCrLf & _
           "1. Se abrió tu cliente de correo con el mensaje pre-llenado" & vbCrLf & _
           "2. Se abrió la carpeta con el archivo ZIP" & vbCrLf & vbCrLf & _
           "ARRastra el archivo ZIP al correo antes de enviar:" & vbCrLf & _
           fso.GetFileName(latestZip) & vbCrLf & vbCrLf & _
           "El archivo está seleccionado en la carpeta que se abrió.", vbInformation + vbSystemModal, "Adjuntar Archivo Manualmente"
Else
    Set objMail = objOutlook.CreateItem(0)
    objMail.To = destinatario
    objMail.Subject = asunto
    objMail.Body = mensaje
    ' Asegurar que el archivo existe antes de adjuntarlo
    If fso.FileExists(latestZip) Then
        objMail.Attachments.Add latestZip
        objMail.Display
        MsgBox "✓ Outlook abierto con el correo pre-configurado" & vbCrLf & vbCrLf & _
               "Archivo adjunto: " & fso.GetFileName(latestZip) & vbCrLf & vbCrLf & _
               "Solo haz clic en 'Enviar'.", vbInformation + vbSystemModal, "Listo para Enviar"
    Else
        MsgBox "ERROR: No se encontró el archivo ZIP: " & latestZip, vbCritical, "Error"
    End If
End If
On Error GoTo 0

