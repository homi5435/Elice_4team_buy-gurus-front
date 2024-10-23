import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/interceptors';
import axios from 'axios';
import ReviewForm from './Component/ReviewForm.jsx';
import ReviewCard from './Component/ReviewCard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 추가
import { Pagination } from 'react-bootstrap';
import EditReviewModal from './Component/EditReviewModal'; // 수정 모달 임포트
import DeleteReviewModal from './Component/DeleteReviewModal'; // 삭제 모달 임포트
import { useUserContext } from '../../context/UserContext.jsx';
import DeleteProduct from './Component/DeleteProduct.jsx';
import Header from '../../components/Header.jsx';
import './style/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams(); // URL 파라미터에서 상품 ID 가져오기
    const navigate = useNavigate();
    const { user } = useUserContext();


    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]); // 리뷰 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [showEditModal, setShowEditModal] = useState(false); // 수정 모달 상태
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 상태
    const [editReview, setEditReview] = useState(null); // 수정할 리뷰 정보
    const [mainImage, setMainImage] = useState(''); // 큰 이미지 상태
    const [userQuantity, setUserQuantity] = useState(1);
    
    

    useEffect(() => {
        const fetchProductDetail = async () => {
            // ID 유효성 검사
            if (!id || isNaN(Number(id))) {
                setError('유효하지 않은 상품 ID입니다.');
                setLoading(false);
                return;
            }

            try {
                // 요청 전 로깅
                console.log('Fetching product with ID:', id);
                
                const response = await axios.get(`/api/product/${id}`, {
                    // 요청 설정 추가
                    validateStatus: function (status) {
                        return status < 500; // 500 미만의 상태 코드는 에러로 처리하지 않음
                    }
                });

                // 응답 로깅
                console.log('Server response:', response);

                if (response.status === 400) {
                    throw new Error('잘못된 요청입니다. 상품 ID를 확인해주세요.');
                }

                if (response.status === 404) {
                    throw new Error('상품을 찾을 수 없습니다.');
                }

                if (!response.data) {
                    throw new Error('서버에서 데이터를 받지 못했습니다.');
                }

                setProduct(response.data);
                setError(null);
                
            } catch (error) {
                console.error('상품 정보 조회 중 오류 발생:', error);
                
                // 자세한 에러 메시지 설정
                let errorMessage = '상품 정보를 가져오는 데 실패했습니다.';
            
                
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id, navigate]);


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/api/product/${id}/review?page=${currentPage - 1}&size=9`);
                setReviews(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('리뷰를 가져오는 데 오류가 발생했습니다:', error);
                alert('리뷰를 가져오는 데 오류가 발생했습니다.'); // 사용자에게 알림
            }
        };

        fetchReviews();
    }, [id, currentPage]);

    const handleEditReview = (review) => {
        setEditReview(review);
        setShowEditModal(true); // 수정 모달 열기
    };

    const handleDeleteReview = (review) => {
        setEditReview(review);
        setShowDeleteModal(true); // 삭제 모달 열기
    };

    const confirmEdit = async (editedReview) => {
        try {
            const response = await axiosInstance.patch(`/api/review/${editedReview.id}`, {
                rating: editedReview.rating,
                comment: editedReview.comment,
                productId: editedReview.productId,
            });
            if (response.status === 200) {
                setReviews(reviews.map(r => (r.id === editedReview.id ? { ...r, ...editedReview } : r))); // 상태 업데이트
                setShowEditModal(false); // 모달 닫기
            }
        } catch (error) {
            console.error('리뷰 수정 중 오류 발생:', error);
            alert('리뷰 수정에 실패했습니다.');
        }
    };

    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/api/review/${editReview.id}`); // 리뷰 삭제 API 호출
            setShowDeleteModal(false); // 모달 닫기
            setReviews(reviews.filter(review => review.id !== editReview.id)); // 상태 업데이트
        } catch (error) {
            console.error('리뷰 삭제 중 오류 발생:', error);
        }
    };

    const handleAddToCart = async () => {
        if (userQuantity > product.quantity) { // 수량이 재고 수량보다 많으면 경고
            alert('재고 수량보다 많은 수량을 입력할 수 없습니다.');
            return;
        }

        try {
            console.log(userQuantity)
            await axiosInstance.post(`/api/orderitem/${id}`, {
                amount: userQuantity // 수량과 함께 요청
            });
            console.log(userQuantity)
            alert('장바구니에 추가되었습니다!'); // 사용자에게 알림
            setUserQuantity(1); // 수량 초기화
        } catch (error) {
            console.error('장바구니 추가 중 오류 발생:', error);
            alert('장바구니에 추가하는 데 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div className="text-center">로딩 중...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">오류 발생</h4>
                <p>{error}</p>
                <hr />
                <p className="mb-0">
                    <button 
                        className="btn btn-outline-danger"
                        onClick={() => navigate(-1)}
                    >
                        이전 페이지로 돌아가기
                    </button>
                </p>
            </div>
        );
    }

    if (!product) {
        return <div>상품을 찾을 수 없습니다.</div>; // 상품이 없을 때 표시
    }

    // 상품 수정 핸들러
    const handleEditProduct = () => {
        navigate(`/product-create`, {state: product});
    };

    return (
        <div className="product-detail-container mt-4">
            <Header />
            {user && user.role === 'ADMIN' && (
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-primary" onClick={handleEditProduct}>
                        상품 수정
                    </button>
                    <DeleteProduct productId={id} />
                </div>
            )}
            <h1 className="mb-3">{product.name}</h1>

            <div className="d-flex mb-3">
                {/* 메인 이미지 및 썸네일 */}
                <div className="me-3">
                    {mainImage && (
                        <img src={mainImage} alt={product.name} className="img-fluid mb-3 product-main-image" />
                    )}
                    <div className="d-flex flex-wrap">
                        {product.imageUrls && product.imageUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`product-thumbnail-${index}`}
                                className="img-thumbnail me-2 thumbnail"
                                onClick={() => setMainImage(url)} // 클릭 시 큰 이미지 변경
                            />
                        ))}
                    </div>
                </div>

                {/* 상품 정보 및 구매 수량 */}
                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between">
                        <div>
                            <p className="h5">가격
                            <div class="alert alert-light" role="alert">
                                \{product.price?.toLocaleString()}
                            </div></p>
                            <p className="h5">남은 재고
                                <div class="alert alert-light" role="alert">
                                    {product.quantity}
                                </div>
                            </p>
                            <p className="h5">카테고리 분류
                                <div class="alert alert-light" role="alert">
                                    {product.category}
                                </div>
                            </p>
                        </div>
                        <div className="d-flex flex-column align-items-end" >
                            <label htmlFor="userQuantity" className="me-2">구매 수량</label>
                            <input
                                type="number"
                                id="userQuantity"
                                value={userQuantity}
                                onChange={(e) => setUserQuantity(Math.max(1, Number(e.target.value)))}
                                min="1"
                                className="form-control me-2"
                                style={{ width: '100px' }}
                            />
                            <button className="btn btn-success mt-2" onClick={handleAddToCart}>
                                장바구니에 추가
                            </button>
                        </div>
                    </div>
                </div>
                {/* 상품 설명 */}
            </div>
            <h5 className='text-center'>상품 설명</h5>
            <div class="alert alert-light" role="alert">
                {product.description}
            </div>

            {/* 구분선 추가 */}
            <hr className="my-4" />

            <h2>리뷰</h2>
            <ReviewForm productId={id} setReviews={setReviews} />
            <div className="row mt-4">
                {reviews.map((review) => (
                    <div className="col-md-4 mb-3" key={review.id}>
                        <ReviewCard 
                            review={review} 
                            onEdit={handleEditReview} 
                            onDelete={handleDeleteReview} 
                        />
                    </div>
                ))}
            </div>

            <Pagination className="mt-4">
                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            </Pagination>

            {showEditModal && editReview && (
                <EditReviewModal 
                    show={showEditModal} 
                    onHide={() => setShowEditModal(false)} 
                    review={editReview} 
                    onSave={confirmEdit}
                />
            )}

            <DeleteReviewModal 
                show={showDeleteModal} 
                onHide={() => setShowDeleteModal(false)} 
                onDelete={confirmDelete} 
            />
        </div>
    );
};

export default ProductDetail;