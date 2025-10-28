import polyglotI18nProvider from "ra-i18n-polyglot";
import spanishMessages from "ra-language-spanish";

console.log("i18nProvider: Inicializando proveedor de idioma español");

const customSpanishMessages = {
  ...spanishMessages,
  ra: {
    ...spanishMessages.ra,
    action: {
      ...spanishMessages.ra.action,
      delete: "Eliminar",
      show: "Mostrar",
      list: "Listar",
      save: "Guardar",
      create: "Crear",
      edit: "Editar",
      cancel: "Cancelar",
      confirm: "Confirmar",
      refresh: "Actualizar",
      add: "Añadir",
      remove: "Quitar",
      close: "Cerrar",
    },
    notification: {
      ...spanishMessages.ra.notification,
      deleted: "Usuario eliminado",
      updated: "Usuario actualizado",
      created: "Usuario creado",
    },
    message: {
      ...spanishMessages.ra.message,
      delete_content: "¿Está seguro de que desea eliminar este usuario?",
      delete_title: "Eliminar usuario",
    },
    navigation: {
      ...spanishMessages.ra.navigation,
      page_rows_per_page: "Filas por página:",
      page_range_info: "%{offsetBegin}-%{offsetEnd} de %{total}",
      prev: "Anterior",
      next: "Siguiente",
      page_out_of_boundaries: "Página fuera de límites",
      page_out_from_end: "No se puede ir después de la última página",
      page_out_from_begin: "No se puede ir antes de la página 1",
    },
  },
};

console.log("i18nProvider: Mensajes personalizados configurados");

export const i18nProvider = polyglotI18nProvider(
  () => customSpanishMessages,
  "es",
);
