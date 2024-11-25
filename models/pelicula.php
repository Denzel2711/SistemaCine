<?php
class Pelicula extends Conectar
{
    public function verificar_funciones($peliculaId)
    {
        $conexion = parent::conectar_bd();
        $sql = "SELECT COUNT(*) FROM Funciones WHERE PeliculaId = ? AND Estado = 1";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$peliculaId]);
        $result = $stmt->fetchColumn();
        return $result > 0; 
    }

    public function obtener_peliculas()
    {
        $conexion = parent::conectar_bd();
        $consulta = $conexion->prepare("SELECT * FROM peliculas WHERE Estado=1");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertar_pelicula($titulo, $genero, $duracion)
    {
        $conexion = parent::conectar_bd();
        $sql = "INSERT INTO peliculas (Titulo, Genero, Duracion, Estado) VALUES (?, ?, ?, 1)";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$titulo, $genero, $duracion]);
    }

    public function eliminar_pelicula($id)
    {
        if ($this->verificar_funciones($id)) {
            return ['error' => 'No se puede eliminar. La película está en una función existente.'];
        }
        $conexion = parent::conectar_bd();
        $sql = "UPDATE peliculas SET Estado=0 WHERE Id=?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$id]);
        return ['success' => 'Película eliminada correctamente.'];
    }

    public function actualizar_pelicula($id, $titulo, $genero, $duracion)
    {
        if ($this->verificar_funciones($id)) {
            return ['error' => 'No se puede editar. La película está en una función existente.'];
        }
        $conexion = parent::conectar_bd();
        $sql = "UPDATE peliculas SET Titulo=?, Genero=?, Duracion=? WHERE Id=?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$titulo, $genero, $duracion, $id]);
        return ['success' => 'Película actualizada correctamente.'];
    }
}
