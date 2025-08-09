'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Clock, Eye, ArrowLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishDate: string;
  readTime: number;
  views: number;
  category: string;
  author: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Hướng dẫn gửi tiền an toàn và hiệu quả",
    excerpt: "Tìm hiểu các phương pháp gửi tiền an toàn nhất và cách tối ưu hóa lợi nhuận từ việc đầu tư...",
    content: "Nội dung chi tiết về cách gửi tiền an toàn...",
    image: "/api/placeholder/400/250",
    publishDate: "2024-03-15",
    readTime: 5,
    views: 1250,
    category: "Tài chính",
    author: "Nguyễn Văn A"
  },
  {
    id: 2,
    title: "Xu hướng đầu tư 2024: Những cơ hội không thể bỏ lỡ",
    excerpt: "Phân tích các xu hướng đầu tư mới nhất và những cơ hội sinh lời trong năm 2024...",
    content: "Nội dung chi tiết về xu hướng đầu tư...",
    image: "/api/placeholder/400/250",
    publishDate: "2024-03-12",
    readTime: 8,
    views: 2100,
    category: "Đầu tư",
    author: "Trần Thị B"
  },
  {
    id: 3,
    title: "Cách quản lý tài chính cá nhân hiệu quả",
    excerpt: "Những mẹo và chiến lược giúp bạn quản lý tài chính cá nhân một cách thông minh...",
    content: "Nội dung chi tiết về quản lý tài chính...",
    image: "/api/placeholder/400/250",
    publishDate: "2024-03-10",
    readTime: 6,
    views: 890,
    category: "Quản lý",
    author: "Lê Văn C"
  },
  {
    id: 4,
    title: "Phân tích thị trường chứng khoán tuần này",
    excerpt: "Cập nhật tình hình thị trường chứng khoán và dự báo xu hướng trong tuần tới...",
    content: "Nội dung phân tích thị trường...",
    image: "/api/placeholder/400/250",
    publishDate: "2024-03-08",
    readTime: 7,
    views: 1580,
    category: "Phân tích",
    author: "Phạm Thị D"
  },
  {
    id: 5,
    title: "Bí quyết tiết kiệm tiền hiệu quả cho người trẻ",
    excerpt: "Những phương pháp tiết kiệm tiền thông minh dành cho thế hệ trẻ...",
    content: "Nội dung về tiết kiệm tiền...",
    image: "/api/placeholder/400/250",
    publishDate: "2024-03-05",
    readTime: 4,
    views: 950,
    category: "Tiết kiệm",
    author: "Hoàng Văn E"
  }
];

const categories = ['Tất cả', 'Tài chính', 'Đầu tư', 'Quản lý', 'Phân tích', 'Tiết kiệm'];

export default function ArticlesPage() {
  const [articles] = useState<Article[]>(mockArticles);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterArticles(term, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterArticles(searchTerm, category);
  };

  const filterArticles = (search: string, category: string) => {
    let filtered = articles;

    if (search) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'Tất cả') {
      filtered = filtered.filter(article => article.category === category);
    }

    setFilteredArticles(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tin tức & Bài viết</h1>
              <p className="text-sm text-gray-500">Cập nhật thông tin tài chính mới nhất</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Filter className="h-4 w-4 mr-1" />
                Bộ lọc {showFilters ? '▲' : '▼'}
              </button>

              {/* Category Filter */}
              {showFilters && (
                <div className="pt-2 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Hiển thị {filteredArticles.length} / {articles.length} bài viết
          </div>

          {/* Articles List */}
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Article Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Hình ảnh bài viết</span>
                </div>

                {/* Article Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(article.publishDate)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime} phút đọc
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {article.views.toLocaleString()} lượt xem
                      </span>
                    </div>
                    <span>Bởi {article.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài viết</h3>
              <p className="text-sm text-gray-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
