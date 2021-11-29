#CRC Card


##User
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>has unique username</li>
    <li>can log in
    <li>can make posts</li>
    <li>can up/downvote posts</li>
    <li>has a user profile</li>
    <li>can be an Admin</li>
</td>
<td>
    <li>Post</li>
    <li>Board</li>
    <li>Category</li>
</td>
</tr>

</table>

##Board
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Display posts</li>
    <li>Sort posts</li>
    <li>Updates when new post is created</li>
</td>
<td>
    <li>User</li>
    <li>Post</li>
    <li>Category</li>
</td>
</tr>

</table>

##Post
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Identify creator</li>
    <li>Display content</li>
    <li>Has a title</li>
    <li>Can include an image</li>
    <li>Is part of the board</li>
    <li>Has a postCategory</li>
    <li>Can be deleted or edited by the creator or an admin</li>
    
</td>
<td>
    <li>User</li>
    <li>Board</li>
    <li>Category</li>
</td>
</tr>

</table>

##PostCategory
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Holds the name of the category</li>
    <li>Can be created by an admin or directly via database</li>
</td>
<td>
    <li>User</li>
    <li>Post</li>
</td>
</tr>

</table>

##ItemImage
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Can be uploaded by a user from his files, must be of type .pgn or .jpeg</li>
    <li>Belongs to a post</li>
</td>
<td>
    <li>User</li>
    <li>Post</li>
</td>
</tr>

</table>

</table>

##Likes
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Belongs to a post</li>
    <li>Keeps track of all the user who have liked the post</li>
    <li>Makes sure that a post can only be liked once by a user</li>
</td>
<td>
    <li>User</li>
    <li>Post</li>
</td>
</tr>

</table>

</table>

##ShopCategory
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Holds the name of the category</li>
    <li>Can be created by an admin or directly via database</li>
</td>
<td>
    <li>User</li>
    <li>Product</li>
</td>
</tr>

</table>

</table>

##Product
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Has a productname</li>
    <li>Holds the name of the category</li>
    <li>Has a productcategory assigned like "clothing"</li>
    <li>Has a description of the product</li>
    <li>May contain an image showing the product</li>
    <li>Has a price assigned to it</li>
    <li>Can be created, edited and deleted by an admin</li>
</td>
<td>
    <li>User</li>
    <li>Order</li>
</td>
</tr>

</table>

</table>

##ProductImage
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Can be uploaded by an admin from his files, must be of type .pgn or .jpeg</li>
    <li>Belongs to a product</li>
</td>
<td>
    <li>User</li>
    <li>Product</li>
</td>
</tr>

</table>

</table>

##Order
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Contains the address data of the ordering person</li>
    <li>Only one product at a time is ordered</li>
    <li>Contains the status of the delivery</li>
    <li>May be cancelled by the ordering person</li>
    <li>Admin is responsible for shipping</li>
    <li>Has a field for the payment method</li>
</td>
<td>
    <li>User</li>
    <li>Product</li>
</td>
</tr>

</table>