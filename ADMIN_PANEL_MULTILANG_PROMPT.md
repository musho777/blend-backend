# Admin Panel Multi-Language Implementation Prompt

## Context
The backend API has been updated to support Armenian (am) and Russian (ru) translations for products, categories, and subcategories. The admin panel needs to be updated to allow administrators to manage these multi-language fields.

## Backend Changes Already Implemented

### Products
- `title` (English - required)
- `titleAm` (Armenian - optional)
- `titleRu` (Russian - optional)
- `description` (English - optional)
- `descriptionAm` (Armenian - optional)
- `descriptionRu` (Russian - optional)

### Categories
- `title` (English - required)
- `titleAm` (Armenian - optional)
- `titleRu` (Russian - optional)
- `slug` (auto-generated from English title)
- `image` (category image URL)

### Subcategories
- `title` (English - required)
- `titleAm` (Armenian - optional)
- `titleRu` (Russian - optional)
- `categoryId` (parent category - required)

## Requirements

### 1. Product Management (Create/Edit Product Pages)

**Form Fields Structure:**
- Group language fields with tabs or accordion sections
- Three language sections: English (default), Armenian (Հայերեն), Russian (Русский)

**English Section (Required):**
- Title (text input - required)
- Description (textarea - optional)
- Price (number input - required)
- Stock (number input - required)
- Category (dropdown - required)
- Subcategory (dropdown - optional, filtered by selected category)
- Images (file upload - multiple files)
- Featured (checkbox)
- Best Seller (checkbox)
- Best Select (checkbox)
- Priority (number input)
- Disabled (checkbox)

**Armenian Section (Optional):**
- Title in Armenian (text input - optional)
- Description in Armenian (textarea - optional)
- *Note: Display placeholder text like "Leave empty to use English title"*

**Russian Section (Optional):**
- Title in Russian (text input - optional)
- Description in Russian (textarea - optional)
- *Note: Display placeholder text like "Leave empty to use English title"*

**UI/UX Recommendations:**
- Use tabs at the top: [English*] [Հայերեն] [Русский]
- Mark English tab with asterisk (*) to indicate required
- Show language flag icons next to language names
- Use consistent styling across all language tabs
- Preserve form state when switching between tabs
- Show validation errors specific to each language tab

### 2. Category Management (Create/Edit Category Pages)

**Form Fields Structure:**

**English Section (Required):**
- Title (text input - required)
- Slug (text input - optional, auto-generated from title)
- Image (file upload - single file)

**Armenian Section (Optional):**
- Title in Armenian (text input - optional)

**Russian Section (Optional):**
- Title in Russian (text input - optional)

**UI/UX Recommendations:**
- Same tab structure as products
- Auto-generate slug only from English title
- Display current image preview if editing existing category

### 3. Subcategory Management (Create/Edit Subcategory Pages)

**Form Fields Structure:**

**English Section (Required):**
- Title (text input - required)
- Parent Category (dropdown - required)

**Armenian Section (Optional):**
- Title in Armenian (text input - optional)

**Russian Section (Optional):**
- Title in Russian (text input - optional)

**UI/UX Recommendations:**
- Same tab structure as products and categories
- Show parent category name prominently

### 4. Data Table Display

**Products List Table:**
- Display English title as primary
- Add language indicator icons if translations exist
- Example: "iPhone 15 Pro 🇬🇧 🇦🇲 🇷🇺" (shows which languages are available)
- On hover, show tooltip with translations

**Categories List Table:**
- Display English title as primary
- Show translation status indicators
- Example: "Electronics [EN, AM, RU]"

**Subcategories List Table:**
- Display English title as primary
- Show parent category
- Show translation status indicators

### 5. API Integration

**Endpoints Already Available:**

**Products:**
- `POST /api/products` - Create product with language fields
- `PATCH /api/products/:id` - Update product with language fields
- `GET /api/products/:id` - Get product with all language fields

**Categories:**
- `POST /api/categories` - Create category with language fields
- `PATCH /api/categories/:id` - Update category with language fields
- `GET /api/categories/:id` - Get category with all language fields

**Subcategories:**
- `POST /api/subcategories` - Create subcategory with language fields
- `PATCH /api/subcategories/:id` - Update subcategory with language fields
- `GET /api/subcategories/:id` - Get subcategory with all language fields

**Request Body Example (Product):**
```json
{
  "title": "iPhone 15 Pro",
  "titleAm": "Այֆոն 15 Պրո",
  "titleRu": "Айфон 15 Про",
  "description": "Latest iPhone with advanced features",
  "descriptionAm": "Վերջին Այֆոնը առաջադեմ հնարավորություններով",
  "descriptionRu": "Новейший iPhone с расширенными возможностями",
  "price": 999.99,
  "stock": 50,
  "categoryId": "550e8400-e29b-41d4-a716-446655440000",
  "subcategoryId": "660e8400-e29b-41d4-a716-446655440001",
  "imageUrls": ["https://storage.googleapis.com/..."],
  "isFeatured": true,
  "isBestSeller": false,
  "isBestSelect": false,
  "priority": 10,
  "disabled": false
}
```

**Request Body Example (Category):**
```json
{
  "title": "Electronics",
  "titleAm": "Էլեկտրոնիկա",
  "titleRu": "Электроника",
  "slug": "electronics",
  "image": "https://storage.googleapis.com/..."
}
```

**Request Body Example (Subcategory):**
```json
{
  "title": "Smartphones",
  "titleAm": "Սմարթֆոններ",
  "titleRu": "Смартфоны",
  "categoryId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 6. Form Validation

**Client-Side Validation:**
- English title is required for all entities
- Language-specific fields (Armenian, Russian) are optional
- If description is provided in Armenian/Russian, it should accept Unicode characters
- Price and stock must be positive numbers
- Category must be selected for products and subcategories

**Server-Side Validation:**
- Backend validates all required fields
- Returns validation errors in array format:
  ```json
  {
    "message": ["property titleAm should not exist"],
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

### 7. UI Components to Build

**Language Tabs Component:**
```tsx
interface LanguageTab {
  code: string; // 'en', 'am', 'ru'
  label: string; // 'English', 'Հայերեն', 'Русский'
  flag: string; // '🇬🇧', '🇦🇲', '🇷🇺' or flag icon
  required: boolean; // true for English, false for others
}
```

**Multi-Language Input Component:**
```tsx
interface MultiLangInputProps {
  name: string; // field name like 'title'
  type: 'text' | 'textarea';
  required: boolean;
  placeholder: {
    en: string;
    am: string;
    ru: string;
  };
  value: {
    en: string;
    am: string;
    ru: string;
  };
  onChange: (lang: string, value: string) => void;
}
```

### 8. State Management

**Form State Structure:**
```typescript
interface ProductFormState {
  // English (required)
  title: string;
  description: string;

  // Armenian (optional)
  titleAm: string;
  descriptionAm: string;

  // Russian (optional)
  titleRu: string;
  descriptionRu: string;

  // Other fields
  price: number;
  stock: number;
  categoryId: string;
  subcategoryId: string;
  imageUrls: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isBestSelect: boolean;
  priority: number;
  disabled: boolean;
}
```

### 9. Testing Checklist

**Functionality Tests:**
- [ ] Create product with only English fields
- [ ] Create product with all language fields
- [ ] Create product with English + Armenian only
- [ ] Create product with English + Russian only
- [ ] Update product and add translations
- [ ] Update product and remove translations (set to empty string)
- [ ] Create category with all language fields
- [ ] Create subcategory with all language fields
- [ ] Switch between language tabs without losing data
- [ ] Submit form and verify correct API payload
- [ ] Display validation errors correctly
- [ ] Display existing translations when editing

**UI/UX Tests:**
- [ ] Tab navigation works smoothly
- [ ] Form state persists across tab switches
- [ ] Placeholders are helpful and in correct language
- [ ] Validation errors show on correct tab
- [ ] Armenian/Russian text input works correctly
- [ ] Unicode characters display properly in forms and tables
- [ ] Mobile responsive design works

### 10. Design Mockup Guidelines

**Color Coding (Optional):**
- English tab: Blue accent (primary language)
- Armenian tab: Orange accent
- Russian tab: Red accent

**Layout Priority:**
1. Desktop: Side-by-side tabs or horizontal tabs
2. Tablet: Horizontal tabs
3. Mobile: Accordion or vertical stacked sections

**Accessibility:**
- Use semantic HTML
- Add ARIA labels for language tabs
- Ensure keyboard navigation works
- Maintain sufficient color contrast

### 11. Additional Features (Nice to Have)

**Translation Assistant:**
- Add "Copy from English" button for Armenian/Russian fields
- Show character count for all text fields
- Add "Clear translations" button to reset all language fields

**Bulk Operations:**
- Bulk update to add translations to multiple products
- Export products with missing translations
- Import translations from CSV/Excel

**Preview:**
- Live preview showing how product/category appears in each language
- Toggle between languages in preview mode

## Technical Stack Assumptions

- **Framework:** React.js or Next.js (or your specific framework)
- **Form Library:** React Hook Form, Formik, or native form handling
- **UI Components:** Material-UI, Ant Design, Chakra UI, or custom components
- **HTTP Client:** Axios, Fetch API, or your preferred client
- **State Management:** Redux, Context API, Zustand, or component state

## Implementation Priority

**Phase 1 (Must Have):**
1. Add language tab component
2. Update product form with multi-language fields
3. Update category form with multi-language fields
4. Update subcategory form with multi-language fields
5. API integration for create/update operations

**Phase 2 (Should Have):**
6. Update data tables to show translation indicators
7. Form validation for all language fields
8. Error handling and user feedback

**Phase 3 (Nice to Have):**
9. Translation assistant features
10. Bulk operations
11. Advanced filtering/search by language

## Questions to Address Before Implementation

1. Which UI component library is the admin panel using?
2. What is the current form handling approach?
3. Are there existing multi-language components to reference?
4. What is the preferred tab/accordion library?
5. Should Armenian/Russian keyboards be supported?
6. Are there specific brand guidelines for language indicators?
7. Should there be a way to set a "default language" per product?

## Success Criteria

- ✅ Admin can create products/categories/subcategories with all three languages
- ✅ Admin can update existing items to add/remove translations
- ✅ Form validates correctly (English required, others optional)
- ✅ Data persists correctly across tab switches
- ✅ API requests send correct payload structure
- ✅ UI is intuitive and user-friendly
- ✅ Armenian and Russian text displays correctly throughout the admin panel
- ✅ No data loss when switching between language tabs
