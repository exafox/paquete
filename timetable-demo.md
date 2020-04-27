---
title: WORKING
layout: default
---


<link rel="stylesheet" href="timetable/dist/styles/timetablejs.css">
<link rel="stylesheet" href="timetable/dist/styles/demo.css">

<div class="hero-unit">
    <h1>Timetable.js demo</h1>
    <p>Vanilla javascript plugin for building nice responsive timetables. More info on <a href="https://github.com/Grible/timetable.js" target="_blank">Github</a>.</p>
</div>

<div class="timetable"></div>

<script src="timetable/dist/scripts/timetable.js"></script>

<script>
    var timetable = new Timetable();

    timetable.setScope(9,3)


      timetable.addLocations(['Animals',
        'Books',
        'Education',
        'Films',
        'Fitness and exercise',
        'Games',
        'Kids',
        'Live music',
        'Religion and spirituality',
        'Sports',
        'Tech',
        'World Buskers Buskerfest',
        'Videogames']);


{% for event in site.data.events %}

    timetable.addEvent(
        '{{ event.title | escape }}', 
        '{{ event.category | escape }}', 
        new Date('{{ event.start-time }}'), 
        new Date('{{ event.end-time }}'), 
        { 
            url: '{{ event.link }}' 
        });

{% endfor %}




    var renderer = new Timetable.Renderer(timetable);
    renderer.draw('.timetable');
</script>
<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
<!-- 
<script>
    (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
    function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
    e=o.createElement(i);r=o.getElementsByTagName(i)[0];
    e.src='//www.google-analytics.com/analytics.js';
    r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
    ga('create','UA-37417680-5');ga('send','pageview');
</script> -->
