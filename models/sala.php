<?php
class Sala extends Conectar
{
    public function verificar_funciones($salaId)
    {
        $conexion = parent::conectar_bd();
        $sql = "SELECT COUNT(*) FROM Funciones WHERE SalaId = ? AND Estado = 1";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$salaId]);
        $result = $stmt->fetchColumn();
        return $result > 0;
    }

    public function listar_salas()
    {
        $conexion = parent::conectar_bd();
        $sql = "SELECT * FROM Salas WHERE Estado = 1";
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertar_sala($nombre, $capacidad, $tipo)
    {
        $conexion = parent::conectar_bd();
        $sql = "INSERT INTO Salas (Nombre, Capacidad, Tipo, Estado) VALUES (?, ?, ?, 1)";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$nombre, $capacidad, $tipo]);
    }

    public function eliminar_sala($id)
    {
        if ($this->verificar_funciones($id)) {
            return ['error' => 'No se puede eliminar. La sala está en una función existente.'];
        }
        $conexion = parent::conectar_bd();
        $sql = "UPDATE Salas SET Estado=0 WHERE Id=?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$id]);
        return ['success' => 'Sala eliminada correctamente.'];
    }

    public function actualizar_sala($id, $nombre, $capacidad, $tipo)
    {
        if ($this->verificar_funciones($id)) {
            return ['error' => 'No se puede editar. La sala está en una función existente.'];
        }
        $conexion = parent::conectar_bd();
        $sql = "UPDATE Salas SET Nombre=?, Capacidad=?, Tipo=? WHERE Id=?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$nombre, $capacidad, $tipo, $id]);
        return ['success' => 'Sala actualizada correctamente.'];
    }
}
