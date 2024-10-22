import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './Component/ReviewForm.jsx';
import ReviewCard from './Component/ReviewCard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 추가
import { Pagination } from 'react-bootstrap';
import EditReviewModal from './Component/EditReviewModal'; // 수정 모달 임포트
import DeleteReviewModal from './Component/DeleteReviewModal'; // 삭제 모달 임포트
import ConfirmEditModal from './Component/ConfirmEditModal'; // 수정 확인 모달 임포트
import { useUserContext } from '../../context/UserContext.jsx';
import DeleteProduct from './Component/DeleteProduct.jsx';

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
    const [showConfirmEditModal, setShowConfirmEditModal] = useState(false); // 수정 확인 모달 상태
    const [editReview, setEditReview] = useState(null); // 수정할 리뷰 정보
    const [mainImage, setMainImage] = useState(''); // 큰 이미지 상태
    const [quantity, setQuantity] = useState(1);
    
    

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
                const response = await axios.get(`/api/product/${id}/review?page=${currentPage - 1}&size=10`);
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
            await axios.patch(`/api/review/${editedReview.id}`, { // 수정 API 호출
                rating: editedReview.rating,
                comment: editedReview.comment,
                productId: editedReview.productId,
            });
            setShowEditModal(false); // 모달 닫기
            setReviews(reviews.map(r => (r.id === editedReview.id ? { ...r, ...editedReview } : r))); // 상태 업데이트
        } catch (error) {
            console.error('리뷰 수정 중 오류 발생:', error);
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/review/${editReview.id}`); // 리뷰 삭제 API 호출
            setShowDeleteModal(false); // 모달 닫기
            setReviews(reviews.filter(review => review.id !== editReview.id)); // 상태 업데이트
        } catch (error) {
            console.error('리뷰 삭제 중 오류 발생:', error);
        }
    };

    const handleAddToCart = async () => {
        if (quantity > product.quantity) { // 수량이 재고 수량보다 많으면 경고
            alert('재고 수량보다 많은 수량을 입력할 수 없습니다.');
            return;
        }

        try {
            await axios.post(`/api/orderitem/${id}`, {
                amount: quantity // 수량과 함께 요청
            });
            alert('장바구니에 추가되었습니다!'); // 사용자에게 알림
            setQuantity(1); // 수량 초기화
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
        <div className="container mt-4">
            <div className="d-flex justify-content-end mb-3">
                <button 
                    className="btn btn-primary" 
                    onClick={handleEditProduct}
                >
                    상품 수정
                </button>
                <DeleteProduct 
                    productId={id} 
                />
            </div>
            <h1>{product.name}</h1>
            {mainImage && (
                <img src={mainImage} alt={product.name} className="img-fluid mb-3" style={{ width: '500px', height: 'auto' }}/>
            )}
            <div className="d-flex flex-wrap">
                {product.imageUrls && product.imageUrls.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`product-thumbnail-${index}`}
                        className="img-thumbnail me-2"
                        style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
                        onClick={() => setMainImage(url)} // 클릭 시 큰 이미지 변경
                    />
                ))}
            </div>
            <p>가격: {product.price} 원</p>
            <p>재고: {product.quantity}개</p>
            <p>{product.description}</p>

            {/* 수량 입력란 추가 */}
            <div className="mb-3">
                <label htmlFor="quantity">구매 수량</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} // 수량 업데이트
                    min="1"
                    className="form-control"
                    style={{width: '100px', margin: '10px'}}
                />
            </div>
            <button className="btn btn-success mb-3" onClick={handleAddToCart}>
                장바구니에 추가
            </button>

            <h2>리뷰</h2>
            <ReviewForm productId={id} setReviews={setReviews} /> {/* 리뷰 작성 폼 컴포넌트 */}
            <div className="row mt-4">
                {reviews.map((review) => (
                    <div className="col-md-4" key={review.id}>
                        <ReviewCard 
                            review={review} 
                            user={user} 
                            onEdit={handleEditReview} 
                            onDelete={handleDeleteReview} 
                        />
                    </div>
                ))}
            </div>

            {/* 페이지네이션 추가 */}
            <Pagination>
                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            </Pagination>

            {/* 수정 모달 */}
            {showEditModal && editReview && (
                <EditReviewModal 
                show={showEditModal} 
                onHide={() => setShowEditModal(false)} 
                review={editReview} 
                onSave={confirmEdit}/>
            )}

            {/* 수정 확인 모달 */}
            <ConfirmEditModal 
                show={showConfirmEditModal} 
                onHide={() => setShowConfirmEditModal(false)} 
                onConfirm={() => confirmEdit(editReview)} // 수정 확인 시 실제 수정 함수 호출
            />

            {/* 삭제 모달 */}
            <DeleteReviewModal 
                show={showDeleteModal} 
                onHide={() => setShowDeleteModal(false)} 
                onDelete={confirmDelete} 
            />
        </div>
    );
};

export default ProductDetail;
