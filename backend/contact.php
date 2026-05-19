<?php
/**
 * SHOWTECH SOLUTIONS — Formulario de Contacto
 * Backend: contact.php
 *
 * Configurar las variables de abajo con datos reales.
 * Requiere PHP 7.4+ con la función mail() habilitada
 * o configurar PHPMailer/SMTP para mejor entrega.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

/* ---------- CONFIGURACIÓN ---------- */
$DEST_EMAIL   = 'contacto@showtechsolutions.com.pe'; // Correo destino
$COMPANY_NAME = 'SHOWTECH SOLUTIONS';
$SUBJECT_PREFIX = '[Web] Nuevo contacto desde la web';

/* ---------- Validaciones ---------- */
function sanitize($str) {
    return htmlspecialchars(strip_tags(trim($str)), ENT_QUOTES, 'UTF-8');
}

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/* ---------- Proceso ---------- */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$nombre   = sanitize($_POST['nombre']   ?? '');
$email    = sanitize($_POST['email']    ?? '');
$telefono = sanitize($_POST['telefono'] ?? '');
$tipo     = sanitize($_POST['tipo']     ?? '');
$mensaje  = sanitize($_POST['mensaje']  ?? '');

// Validar campos requeridos
if (empty($nombre) || empty($email) || empty($mensaje)) {
    echo json_encode(['success' => false, 'message' => 'Por favor completa todos los campos requeridos.']);
    exit;
}

if (!isValidEmail($email)) {
    echo json_encode(['success' => false, 'message' => 'El email ingresado no es válido.']);
    exit;
}

if (strlen($mensaje) < 10) {
    echo json_encode(['success' => false, 'message' => 'El mensaje es demasiado corto.']);
    exit;
}

// Anti-spam: honeypot
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true, 'message' => 'OK']); // Silenciar bots
    exit;
}

/* ---------- Construir correo ---------- */
$tipoTexto = !empty($tipo) ? "Tipo de evento: $tipo\n" : '';

$date = date('d/m/Y H:i');

$bodyText = <<<EOT
Nuevo mensaje desde el formulario de contacto de {$COMPANY_NAME}

Nombre:   $nombre
Email:    $email
Teléfono: $telefono
{$tipoTexto}
Mensaje:
$mensaje

---
Enviado el: {$date}
IP: {$_SERVER['REMOTE_ADDR']}
EOT;

$bodyHTML = "
<!DOCTYPE html>
<html lang='es'>
<head><meta charset='UTF-8'><title>Nuevo contacto</title></head>
<body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 24px;'>
  <div style='background: #09090B; padding: 24px; border-radius: 12px; margin-bottom: 0;'>
    <h1 style='color: #C8249A; margin: 0; font-size: 1.4rem;'>SHOWTECH SOLUTIONS</h1>
    <p style='color: #888; margin: 4px 0 0; font-size: 0.85rem;'>Nuevo mensaje desde la web</p>
  </div>
  <div style='background: #fff; padding: 32px; border-radius: 0 0 12px 12px;'>
    <table style='width: 100%; border-collapse: collapse;'>
      <tr><td style='padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 130px; font-size: 0.9rem;'>Nombre</td><td style='padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;'>$nombre</td></tr>
      <tr><td style='padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 0.9rem;'>Email</td><td style='padding: 10px 0; border-bottom: 1px solid #eee;'><a href='mailto:$email' style='color: #C8249A;'>$email</a></td></tr>
      <tr><td style='padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 0.9rem;'>Teléfono</td><td style='padding: 10px 0; border-bottom: 1px solid #eee;'>$telefono</td></tr>
      " . ($tipo ? "<tr><td style='padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 0.9rem;'>Tipo de evento</td><td style='padding: 10px 0; border-bottom: 1px solid #eee;'>$tipo</td></tr>" : '') . "
    </table>
    <div style='margin-top: 24px;'>
      <p style='color: #666; font-size: 0.85rem; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;'>Mensaje:</p>
      <p style='background: #f9f9f9; padding: 16px; border-radius: 8px; border-left: 3px solid #C8249A; line-height: 1.7; color: #333;'>$mensaje</p>
    </div>
    <p style='margin-top: 32px; color: #aaa; font-size: 0.8rem;'>Enviado el $date • IP: {$_SERVER['REMOTE_ADDR']}</p>
  </div>
</body>
</html>
";

/* ---------- Enviar ---------- */
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    "From: $COMPANY_NAME <noreply@showtechsolutions.com.pe>",
    "Reply-To: $nombre <$email>",
    'X-Mailer: PHP/' . phpversion(),
];

$subject = "$SUBJECT_PREFIX — $nombre";
$sent = mail($DEST_EMAIL, $subject, $bodyHTML, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true, 'message' => '¡Mensaje enviado correctamente!']);
} else {
    // Fallback: guardar en log local si mail() falla
    $logLine = date('Y-m-d H:i:s') . " | $nombre | $email | $telefono | " . str_replace("\n", ' ', $mensaje) . PHP_EOL;
    file_put_contents(__DIR__ . '/logs/contacts.log', $logLine, FILE_APPEND | LOCK_EX);
    
    echo json_encode(['success' => true, 'message' => 'Mensaje recibido. Nos comunicaremos pronto.']);
}
