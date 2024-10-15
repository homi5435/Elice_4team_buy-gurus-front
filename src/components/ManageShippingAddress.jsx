import ShippingAddressModal from "@/pages/OrderDetail/component/ShippingAddressModal";

const ManageShippingAddress = ({ isOpen, onClose}) => {
  return (
    <>
      <ShippingAddressModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default ManageShippingAddress;