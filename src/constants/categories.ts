/**
 * Apartados del diario. Un solo historial por detrás; cada apartado
 * añade sus propios campos opcionales (se guardan en `entries.details`).
 */
export type CategoryId = 'vino' | 'whisky' | 'ginebra' | 'ron' | 'cerveza' | 'otro';

export type CategoryField = {
  key: string;
  label: string;
  placeholder?: string;
  numeric?: boolean;
};

export type Category = {
  id: CategoryId;
  label: string;
  fields: CategoryField[];
};

export const Categories: Category[] = [
  {
    id: 'vino',
    label: 'Vinos',
    fields: [
      { key: 'bodega', label: 'Bodega' },
      { key: 'do', label: 'D.O.', placeholder: 'Rioja, Ribera, Tacoronte-Acentejo…' },
      { key: 'anada', label: 'Añada', numeric: true },
      { key: 'uva', label: 'Uva(s)' },
      { key: 'tipo', label: 'Tipo', placeholder: 'Tinto, blanco, rosado, espumoso…' },
    ],
  },
  {
    id: 'whisky',
    label: 'Whiskies',
    fields: [
      { key: 'destileria', label: 'Destilería' },
      { key: 'region', label: 'Región / país' },
      { key: 'edad', label: 'Edad (años)', numeric: true },
      { key: 'barrica', label: 'Barrica' },
      { key: 'graduacion', label: 'Graduación (%)', numeric: true },
    ],
  },
  {
    id: 'ginebra',
    label: 'Ginebras',
    fields: [
      { key: 'destileria', label: 'Destilería' },
      { key: 'botanicos', label: 'Botánicos' },
      { key: 'tonica', label: 'Tónica / mezcla' },
      { key: 'graduacion', label: 'Graduación (%)', numeric: true },
    ],
  },
  {
    id: 'ron',
    label: 'Rones',
    fields: [
      { key: 'productor', label: 'Productor' },
      { key: 'origen', label: 'Origen' },
      { key: 'edad', label: 'Edad (años)', numeric: true },
      { key: 'graduacion', label: 'Graduación (%)', numeric: true },
    ],
  },
  {
    id: 'cerveza',
    label: 'Cervezas',
    fields: [
      { key: 'cerveceria', label: 'Cervecería' },
      { key: 'estilo', label: 'Estilo', placeholder: 'IPA, lager, stout…' },
      { key: 'graduacion', label: 'Graduación (%)', numeric: true },
    ],
  },
  {
    id: 'otro',
    label: 'Otros',
    fields: [{ key: 'productor', label: 'Productor' }],
  },
];

export const categoryById = (id: string) => Categories.find((c) => c.id === id);
