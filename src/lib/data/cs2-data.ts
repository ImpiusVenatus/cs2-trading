// CS2 Data Service - Using downloaded Steam API data
// Import JSON data directly
import steamData from '../../../public/data/data-20251015133115.json';

// Raw Steam API data interface - using any for flexibility with the JSON structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SteamItem = any;

export interface CS2Item {
    id: string;
    name: string;
    condition: string;
    price: number;
    priceChange?: number;
    floatValue?: string;
    patternIndex?: string;
    imageUrl?: string;
    isStatTrak?: boolean;
    isSouvenir?: boolean;
    status?: "online" | "offline";
    category: string;
    rarity: string;
    collection?: string;
    marketHashName: string;
    slug: string;
    salesHistory?: Array<[string, number, number]>; // [date, price, volume]
}

// Transform Steam API data to our interface
function transformSteamData(item: SteamItem): CS2Item {
    const name = item.marketname || item.markethashname || 'Unknown Item';

    // Debug: Log items that might be problematic
    if (!item.marketname && !item.markethashname) {
        console.warn('⚠️ Item missing name:', item);
    }
    if (!item.pricelatest) {
        console.warn('⚠️ Item missing price:', item);
    }

    // Extract condition from market name
    const conditionMatch = name.match(/\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)/);
    const condition = conditionMatch ? conditionMatch[1] : 'Field-Tested';

    // Extract weapon type for category
    const weaponMatch = name.match(/^([^|]+)/);
    const weaponType = weaponMatch ? weaponMatch[1].trim() : 'Unknown';

    // Determine category based on weapon type
    const category = getCategoryFromWeapon(weaponType);

    // Check for StatTrak and Souvenir
    const isStatTrak = name.toLowerCase().includes('stattrak');
    const isSouvenir = name.toLowerCase().includes('souvenir');

    // Generate a random float value for demo purposes
    const floatValue = (Math.random() * 1).toFixed(10);

    // Generate pattern index
    const patternIndex = `#${Math.floor(Math.random() * 1000)}`;

    // Calculate price change (random for demo)
    const priceChange = (Math.random() - 0.5) * 20; // -10% to +10%

    // Use rarity directly from JSON data, fallback to calculated rarity if not present
    const rarity = item.rarity || getRarityFromPrice(item.pricelatest || 0, name);

    return {
        id: `${item.id}-${item.assetid}-${item.classid}` || Math.random().toString(36).substr(2, 9),
        name,
        condition,
        price: item.pricelatest || 0,
        priceChange: Math.round(priceChange * 10) / 10,
        floatValue,
        patternIndex,
        imageUrl: item.image || '',
        isStatTrak,
        isSouvenir,
        status: (Math.random() > 0.5 ? "online" : "offline") as "online" | "offline",
        category,
        rarity,
        marketHashName: item.markethashname || '',
        slug: item.slug || '',
        salesHistory: item.latest10steamsales || []
    };
}

// Categorize weapons
function getCategoryFromWeapon(weaponType: string): string {
    const rifleKeywords = ['AK-47', 'M4A4', 'M4A1-S', 'AWP', 'Galil', 'FAMAS', 'SG 553', 'AUG', 'SSG 08', 'G3SG1', 'SCAR-20'];
    const pistolKeywords = ['Glock-18', 'USP-S', 'P250', 'Five-SeveN', 'Tec-9', 'CZ75-Auto', 'Desert Eagle', 'R8 Revolver', 'Dual Berettas'];
    const smgKeywords = ['MAC-10', 'MP9', 'MP7', 'UMP-45', 'P90', 'PP-Bizon', 'MP5-SD'];
    const heavyKeywords = ['Nova', 'XM1014', 'Sawed-Off', 'MAG-7', 'M249', 'Negev'];
    const knifeKeywords = ['Knife', 'Bayonet', 'Karambit', 'Butterfly', 'Huntsman', 'Falchion', 'Bowie', 'Shadow Daggers', 'Navaja', 'Stiletto', 'Talon', 'Ursus', 'Classic', 'Paracord', 'Survival', 'Skeleton', 'Nomad', 'Gut', 'Flip', 'M9'];
    const gloveKeywords = ['Gloves', 'Hand Wraps', 'Driver Gloves', 'Moto Gloves', 'Specialist Gloves', 'Sport Gloves', 'Bloodhound Gloves', 'Broken Fang Gloves', 'Operation Hydra Gloves', 'Operation Vanguard Gloves'];

    const weapon = weaponType.toLowerCase();

    if (knifeKeywords.some(keyword => weapon.includes(keyword.toLowerCase()))) return 'Knives';
    if (gloveKeywords.some(keyword => weapon.includes(keyword.toLowerCase()))) return 'Gloves';
    if (rifleKeywords.some(keyword => weapon.includes(keyword.toLowerCase()))) return 'Rifles';
    if (pistolKeywords.some(keyword => weapon.includes(keyword.toLowerCase()))) return 'Pistols';
    if (smgKeywords.some(keyword => weapon.includes(keyword.toLowerCase()))) return 'SMGs';
    if (heavyKeywords.some(keyword => weapon.includes(keyword.toLowerCase()))) return 'Heavy';

    return 'Other';
}

// Determine rarity based on item type and price
function getRarityFromPrice(price: number, itemName: string): string {
    const name = itemName.toLowerCase();

    // Special items (knives, gloves) - usually very high value
    if (name.includes('knife') || name.includes('bayonet') || name.includes('karambit') ||
        name.includes('butterfly') || name.includes('huntsman') || name.includes('gloves') ||
        name.includes('hand wraps') || name.includes('driver gloves') || name.includes('moto gloves') ||
        name.includes('specialist gloves') || name.includes('sport gloves') || name.includes('bloodhound gloves')) {
        if (price >= 500) return 'Covert';
        if (price >= 100) return 'Classified';
        return 'Restricted';
    }


    // Regular weapon skins
    if (price >= 1000) return 'Covert';
    if (price >= 100) return 'Classified';
    if (price >= 10) return 'Restricted';
    if (price >= 1) return 'Mil-Spec';
    return 'Consumer';
}

// Filter and search functions
export class CS2DataService {
    private static items: CS2Item[] = [];
    private static initialized = false;

    private static initialize() {
        if (!this.initialized) {
            console.log('🚀 Initializing CS2DataService...');
            console.log('📦 Raw JSON data length:', (steamData as SteamItem[]).length);

            this.items = (steamData as SteamItem[]).map(transformSteamData);

            console.log('✅ Transformed items length:', this.items.length);
            console.log('📊 Items by category:', this.getItemsByCategory());

            this.initialized = true;
        }
    }

    private static getItemsByCategory() {
        const categoryCount: { [key: string]: number } = {};
        this.items.forEach(item => {
            categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        });
        return categoryCount;
    }

    static getItems(params: {
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        wear?: string[];
        special?: string[];
        limit?: number;
        offset?: number;
    } = {}): { items: CS2Item[]; totalCount: number; hasMore: boolean } {
        this.initialize();

        let filteredItems = [...this.items];

        // Debug: Log initial count
        console.log('🔍 Filtering items - Initial count:', filteredItems.length);

        // Apply search filter
        if (params.search) {
            const searchTerm = params.search.toLowerCase();
            const beforeSearch = filteredItems.length;
            filteredItems = filteredItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.marketHashName.toLowerCase().includes(searchTerm)
            );
            console.log(`🔍 Search filter: ${beforeSearch} → ${filteredItems.length} (search: "${params.search}")`);
        }

        // Apply category filter
        if (params.category) {
            const beforeCategory = filteredItems.length;
            filteredItems = filteredItems.filter(item =>
                item.category.toLowerCase() === params.category!.toLowerCase()
            );
            console.log(`🔍 Category filter: ${beforeCategory} → ${filteredItems.length} (category: "${params.category}")`);
        }

        // Apply price filters
        if (params.minPrice !== undefined) {
            filteredItems = filteredItems.filter(item => item.price >= params.minPrice!);
        }
        if (params.maxPrice !== undefined) {
            filteredItems = filteredItems.filter(item => item.price <= params.maxPrice!);
        }

        // Apply wear filters
        if (params.wear && params.wear.length > 0) {
            filteredItems = filteredItems.filter(item =>
                params.wear!.some(wear => item.condition.toLowerCase().includes(wear.toLowerCase()))
            );
        }

        // Apply special filters
        if (params.special && params.special.length > 0) {
            filteredItems = filteredItems.filter(item => {
                return params.special!.some(special => {
                    if (special === 'StatTrak™') return item.isStatTrak;
                    if (special === 'Souvenir') return item.isSouvenir;
                    if (special === 'Highlight') return item.price > 100; // High value items
                    if (special === 'Normal') return !item.isStatTrak && !item.isSouvenir;
                    return true;
                });
            });
        }

        // Apply pagination
        const offset = params.offset || 0;
        const limit = params.limit || 20;
        const paginatedItems = filteredItems.slice(offset, offset + limit);
        const hasMore = offset + limit < filteredItems.length;

        // Debug pagination in data service
        console.log('📊 DataService Pagination:', {
            totalItems: this.items.length,
            filteredItems: filteredItems.length,
            offset,
            limit,
            paginatedItems: paginatedItems.length,
            hasMore
        });

        return {
            items: paginatedItems,
            totalCount: filteredItems.length,
            hasMore
        };
    }

    static getItemById(id: string): CS2Item | null {
        this.initialize();
        return this.items.find(item => item.id === id) || null;
    }

    static searchItems(query: string, limit: number = 20): CS2Item[] {
        this.initialize();
        const results = this.getItems({ search: query, limit });
        return results.items;
    }

    static getCategories(): string[] {
        this.initialize();
        const categories = [...new Set(this.items.map(item => item.category))];
        return categories.sort();
    }

    static getStats() {
        this.initialize();
        return {
            totalItems: this.items.length,
            categories: this.getCategories().length,
            averagePrice: this.items.reduce((sum, item) => sum + item.price, 0) / this.items.length,
            highestPrice: Math.max(...this.items.map(item => item.price)),
            lowestPrice: Math.min(...this.items.map(item => item.price))
        };
    }
}

export default CS2DataService;
