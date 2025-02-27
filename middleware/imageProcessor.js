/**
 *
 * ./middleware/multer.js
 * @fileoverview Middleware para gestionar la subida de archivos en el servidor
 * 
 */

"use strict";

// Imports
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");
const busboy = require("busboy");

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// El procesador de Imagenes transforma y comprime los archivos a .webp y los guarda en Supabase
const imageProcessor = (category) => async (req, res, next) => {
    const bb = busboy({ headers: req.headers });

    req.body = {};
    let fileProcessed = false;

    bb.on("file", (fieldname, file) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
        const bucket = "icpf-imagenes"; // Nombre del bucket en Supabase
        const folder = category === "autores" ? "autores" : "libros";
        const filePath = `${folder}/${uniqueName}`;

        const chunks = [];
        file.on("data", (chunk) => chunks.push(chunk));

        file.on("end", async () => {
            try {
                const buffer = await sharp(Buffer.concat(chunks)).webp().toBuffer();

                const { error } = await supabase.storage
                    .from(bucket)
                    .upload(filePath, buffer, {
                        contentType: "image/webp",
                    });

                if (error) throw error;

                // Obtener la URL pública
                const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(filePath);

                req.file = {
                    url: publicUrl.publicUrl,
                    filename: uniqueName,
                    fieldname,
                };

                fileProcessed = true;
                checkIfFinished();
            } catch (err) {
                console.error("Error al subir a Supabase:", err);
                next(err);
            }
        });
    });

    bb.on("field", (fieldname, value) => {
        req.body[fieldname] = value;
    });

    bb.on("finish", () => {
        console.log("Subida de archivo completada.");
        checkIfFinished();
    });

    bb.on("error", (err) => {
        console.error("Error en la subida:", err);
        next(err);
    });

    req.pipe(bb);

    function checkIfFinished() {
        if (fileProcessed) {
            next();
        }
    }
};

// Función para eliminar imagen de Supabase
const deleteImageFromSupabase = async (imageUrl) => {
    try {
        // Extraer la ruta relativa del archivo desde la URL
        const imagePath = imageUrl.split('supabase.co/storage/v1/object/public/icpf-imagenes/')[1];
    
        if (!imagePath) {
            console.log('No se pudo extraer el path del archivo desde la URL:', imageUrl);
            return;
        }
    
        console.log('Ruta extraída del archivo:', imagePath);
    
        // Intentar eliminar el archivo directamente
        const { error } = await supabase
          .storage
          .from('icpf-imagenes')
          .remove([imagePath]);
    
        if (error) {
            console.error('Error al eliminar la imagen:', error.message);
            throw error;
        } else {
            console.log('Imagen eliminada correctamente:', imagePath);
        }
    } catch (err) {
        console.error('Error en la eliminación de la imagen:', err);
    }
};

module.exports = {
    imageProcessor,
    deleteImageFromSupabase,
};
