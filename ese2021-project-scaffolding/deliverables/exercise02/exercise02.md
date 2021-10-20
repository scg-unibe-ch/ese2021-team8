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
    <li>can up/downvote posts (if user is not an admin)</li>
    <li>has a user profile</li>
    <li>can be an Admin</li>
</td>
<td>
    <li>Post</li>
    <li>Board</li>
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
    <li>Has to have a title</li>
    <li>Has a category</li>
    <li>Is created by one user</li>
    <li>Has a certain amount of up/downvotes</li>
    <li>Can include an image</li>
    <li>Has a date of when it was created </li>
    <li>Can be deleted or edited by the creator or an admin</li>
    <li>Is part of the board</li>
</td>
<td>
    <li>User</li>
    <li>Board</li>
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
    <li>Is made of posts</li>
    <li>Can be sorted by category</li>
    <li>Orders Posts by date</li>
    <li>Updates when a new post is created</li>
</td>
<td>
    <li>User</li>
    <li>Post</li>
</td>
</tr>

</table>

