xây dựng web bán hàng đơn giản vs MERN :

- authen : sử dụng JWT
- client : sử dụng React(copy)
- DB : moongoose

: các chức năng :

- admin : thêm, xóa , sửa mặt hàng, xem thông tin user
- user : mua hàng, chính sửa thông tin tài khoản , thêm giỏ hàng

bug : api /api/v1/user/:id (1) và
api /api/v1/user/logout (2)
-> nếu (1) đứng trước (2) thì khi gọi api vào (2) thì (1) nẽ được gọi vào trước với cái req.params.id = logout => fix :đưa (2) lên trước

- login , logout , register, update password ,update profile, Admin : CRUD
- load product, Admin :CRUD

-login : check local Storage dong bo vs local Storage
