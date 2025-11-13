import polyglotI18nProvider from "ra-i18n-polyglot";
import spanishMessages from "ra-language-spanish";

console.log("i18nProvider: Inicializando proveedor de idioma español");

const customSpanishMessages = {
  ...(spanishMessages as any),
  ra: {
    ...(spanishMessages as any).ra,
    action: {
      ...(spanishMessages as any).ra.action,
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
      clear_filters: "Limpiar filtros",
      export: "Descargar",
    },
    filter: {
      ...(spanishMessages as any).ra.filter,
      clear_filters: "Limpiar filtros",
    },
    notification: {
      ...(spanishMessages as any).ra.notification,
      deleted: "Usuario eliminado",
      updated: "Usuario actualizado",
      created: "Usuario creado",
    },
    message: {
      ...(spanishMessages as any).ra.message,
      delete_content: "¿Está seguro de que desea eliminar este usuario?",
      delete_title: "Eliminar usuario",
    },
    navigation: {
      ...(spanishMessages as any).ra.navigation,
      page_rows_per_page: "Filas por página:",
      page_range_info: "%{offsetBegin}-%{offsetEnd} de %{total}",
      prev: "Anterior",
      next: "Siguiente",
      page_out_of_boundaries: "Página fuera de límites",
      page_out_from_end: "No se puede ir después de la última página",
      page_out_from_begin: "No se puede ir antes de la página 1",
      no_results: "No se encontraron usuarios",
      no_filtered_results: "No se encontraron usuarios con los filtros actuales",
    },
    page: {
      ...(spanishMessages as any).ra.page,
      empty: "No se encontraron usuarios",
    },
  },
};

console.log("i18nProvider: Mensajes personalizados configurados");

export const i18nProvider = polyglotI18nProvider(
  () => customSpanishMessages,
  "es",
);
