<?php
class Funcion extends Conectar
{
    public function listar_funciones()
    {
        $conexion = parent::conectar_bd();
        $sql = "SELECT F.Id, P.Titulo AS Pelicula, S.Nombre AS Sala, F.Fecha, F.Hora, F.Precio 
                FROM Funciones F
                JOIN Peliculas P ON F.PeliculaId = P.Id
                JOIN Salas S ON F.SalaId = S.Id
                WHERE F.Estado = 1";
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertar_funcion($peliculaId, $salaId, $fecha, $hora, $precio)
    {
        $conexion = parent::conectar_bd();
        $sql = "INSERT INTO Funciones (PeliculaId, SalaId, Fecha, Hora, Precio, Estado) VALUES (?, ?, ?, ?, ?, 1)";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$peliculaId, $salaId, $fecha, $hora, $precio]);
    }

    public function actualizar_funcion($id, $peliculaId, $salaId, $fecha, $hora, $precio)
    {
        $conexion = parent::conectar_bd();
        $sql = "UPDATE Funciones SET PeliculaId = ?, SalaId = ?, Fecha = ?, Hora = ?, Precio = ? WHERE Id = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$peliculaId, $salaId, $fecha, $hora, $precio, $id]);
    }

    public function eliminar_funcion($id)
    {
        $conexion = parent::conectar_bd();
        $sql = "UPDATE Funciones SET Estado = 0 WHERE Id = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$id]);
    }
}
?>
