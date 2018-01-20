Archive Member
==============

Allows you to add members to a list that will display as archived across the forum.

 * Total member count is updated.
 * Archived members get dimmed out on certain pages.
     * Members
     * Profile
     * Post
     * Message     
 * Add custom HTML to profiles or tweak the default one.
 * Add HTML to mini profiles so you can customise it further (i.e. archived image).
 * All can be changed by CSS to tweak it how you want it to look.
 
 If you have a custom info area, and the total member count is not getting updated, then you can modify your template to wrap an element around the count variable.
 
 Example:
 
 ```<span class="archive-member-total-members">$[total_members]</span>```
 
 The custom element for profiles:
 
 ```<div id="archived-member-profile-custom"></div>```
 
 That is only needed if you wish write custom HTML, or if the plugin can't find the profile container.  The content of that element is populated from the plugin settings (which you can set).
 
 For mini profiles, a div is injected if you have custom HTML.  You do not need to do this in your templates, as it just injects it into the main mini profile wrapper.  It's then up to you to style it using CSS.
 
 Look at the CSS file for the class names.
 
 ![](https://i.imgur.com/WKyoJZb.png)
 
 ![](https://i.imgur.com/f4QS0d7.png)
 
 Example of using CSS to add an image to the right corner of archived mini profiles.
 
 ![](https://i.imgur.com/EfBMq5V.png)
 