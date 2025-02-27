export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    sortOrder: number;
}

export interface Course {
    courseId: string;
    title: string;
    description: string;
    category: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    instructorId: string;
    lessonsCount: number;
    coverImage: string;
    rating: number;
    totalRatings: number;
    isHot: boolean;
    isNew: boolean;
    price: number;
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    updatedAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
} 