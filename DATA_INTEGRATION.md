# CS2 Trading Platform - Steam API Data Integration

## 🎯 **Data Source**
We're using **real Steam Web API data** downloaded from the official Steam API. The data file contains actual CS2 item prices and market information.

### **Data File Location**
- **Path**: `public/data/data-20251015133115.json`
- **Source**: Steam Web API (Official)
- **Items**: 143 real CS2 items with current market prices
- **Update**: Downloaded on 2025-10-15

## 🔧 **Implementation**

### **Data Service Architecture**
```
src/lib/data/cs2-data.ts     # Main data service
src/hooks/use-cs2-data.ts    # React hooks for data access
src/app/market/page.tsx      # Updated marketplace with real data
```

### **Key Features**
- ✅ **Real Steam Data**: Actual CS2 items and prices
- ✅ **Smart Filtering**: Category, price, wear, special filters
- ✅ **Search Functionality**: Real-time item search
- ✅ **Pagination**: Load more items functionality
- ✅ **Performance**: Optimized data processing
- ✅ **Type Safety**: Full TypeScript support

## 📊 **Data Structure**

### **Item Properties**
```typescript
interface CS2Item {
  id: string;                    // Unique item ID
  name: string;                  // Full item name (e.g., "AK-47 | Case Hardened (Field-Tested)")
  condition: string;             // Wear condition (FN, MW, FT, WW, BS)
  price: number;                 // Current Steam market price
  priceChange?: number;          // Price change percentage
  floatValue?: string;           // Float value (generated for demo)
  patternIndex?: string;         // Pattern index (generated for demo)
  imageUrl?: string;             // Steam image URL
  isStatTrak?: boolean;          // StatTrak™ variant
  isSouvenir?: boolean;          // Souvenir variant
  status?: "online" | "offline"; // Trading status
  category: string;              // Item category (Rifles, Knives, etc.)
  rarity: string;                // Rarity level
  marketHashName: string;        // Steam market hash name
  slug: string;                  // URL-friendly slug
  salesHistory?: Array<[string, number, number]>; // Recent sales data
}
```

### **Categories Supported**
- **Rifles**: AK-47, M4A4, M4A1-S, AWP, Galil, FAMAS, etc.
- **Pistols**: Glock-18, USP-S, P250, Five-SeveN, Desert Eagle, etc.
- **SMGs**: MAC-10, MP9, MP7, UMP-45, P90, etc.
- **Heavy**: Nova, XM1014, Sawed-Off, MAG-7, etc.
- **Knives**: All knife variants and finishes
- **Gloves**: All glove types and finishes
- **Other**: Containers, Stickers, Agents, etc.

## 🚀 **Usage Examples**

### **Basic Item Loading**
```typescript
const { items, isLoading, error } = useCS2Items({
  limit: 20
});
```

### **Filtered Search**
```typescript
const { items } = useCS2Items({
  search: "AK-47",
  category: "Rifles",
  minPrice: 10,
  maxPrice: 1000,
  wear: ["FN", "MW"],
  special: ["StatTrak™"]
});
```

### **Individual Item**
```typescript
const { item, isLoading } = useCS2Item("item-id-123");
```

### **Search Suggestions**
```typescript
const { items } = useCS2ItemSearch("AWP", 10);
```

## 📈 **Performance Features**

### **Data Processing**
- **Lazy Loading**: Data loaded only when needed
- **Smart Caching**: Items cached for better performance
- **Debounced Search**: 500ms delay to prevent excessive filtering
- **Pagination**: Load items in batches of 20

### **Filtering Performance**
- **Category Detection**: Automatic weapon categorization
- **Price Filtering**: Efficient price range filtering
- **Wear Filtering**: Pattern matching for conditions
- **Special Filtering**: StatTrak/Souvenir detection

## 🔄 **Data Flow**

1. **Data Loading**: JSON file loaded once on initialization
2. **Transformation**: Raw Steam data transformed to our format
3. **Filtering**: Applied based on user selections
4. **Pagination**: Items split into pages for performance
5. **Display**: Filtered items rendered in the UI

## 🛠️ **Future Enhancements**

### **When Backend is Ready**
- **Real-time Updates**: Live price updates from Steam API
- **User Favorites**: Save favorite items
- **Price Alerts**: Notifications for price changes
- **Trading History**: Track user transactions

### **Data Improvements**
- **Image URLs**: Actual Steam image integration
- **Float Values**: Real float data from inventories
- **Pattern Indices**: Actual pattern information
- **Sales History**: Historical price charts

## 📝 **Notes**

### **Current Limitations**
- **Static Data**: Prices from download date (2025-10-15)
- **Generated Values**: Float values and pattern indices are demo data
- **No Real-time**: Prices don't update automatically
- **Limited Items**: Only 143 items from Steam API sample

### **Benefits**
- **Real Items**: Actual CS2 items with correct names and categories
- **Accurate Prices**: Real Steam market prices at time of download
- **No API Limits**: No rate limiting or API key requirements
- **Fast Performance**: Local data access is instant

---

*This implementation provides a solid foundation with real CS2 data while maintaining excellent performance and user experience.*
