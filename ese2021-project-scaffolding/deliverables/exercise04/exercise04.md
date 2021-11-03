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
    <li>Has a category</li>
    <li>Can be deleted or edited by creator or an admin</li>
    
</td>
<td>
    <li>User</li>
    <li>Board</li>
    <li>Category</li>
</td>
</tr>

</table>

##Category
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Holds the name of the category</li>
    <li>Can be created by admin or directly via database</li>
</td>
<td>
    <li>User</li>
    <li>Post</li>
</td>
</tr>

</table>

##Image
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