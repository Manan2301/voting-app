const form = document.getElementById('vote-form');
var event

form.addEventListener('submit', e => {
    //const userid=document.querySelector('#user-id')
    const choice = document.querySelector('input[name=candidate]:checked').value;//candidate defined in pusher trigger
    console.log("choice",choice)//choice is say Candidate4(basically the name)
    const data = {candidate: choice};//recreating the object format
    console.log("datainitial",data)
    console.log(JSON.parse(JSON.stringify(data)))

    // var pusher = new Pusher('2d4454b084d59ea08a0b', {
    //     cluster: 'ap2',
    //     encrypted: true
    //     });
 
    //  var channel = pusher.subscribe('login-event');

    //  channel.bind('logged', function(data) {
    //      var id=data.votedByid
    
    // fetch(`http://localhost:3000/poll?id=${{id}}`, {
    //     method: 'post', //after collecting vote response,send a pcandidatet request to update our database
    //     body: JSON.stringify(data), 
        
    //     headers: new Headers({
    //         'Content-Type': 'application/json'           
    //     })
    // })//returns a promise
    //     .then (res => res.json())
    //     .then(data => console.log(data)) 
    //     .catch(err => console.log(err));

    fetch('http://localhost:3000/poll', {
        method: 'post', //after collecting vote response,send a pcandidatet request to update our database
        body: JSON.stringify(data), 
        
        headers: new Headers({
            'Content-Type': 'application/json'           
        })
    })//returns a promise
        .then (res => res.json())
        .then(data => console.log(data)) 
        .catch(err => console.log(err));

    e.preventDefault();
    // })
});



// fetch('http://localhost:3000/poll',{
//     headers: {'Content-Type':undefined}
    
// })
//     .then(res => res.json())
//     .then(data => {
//         let votes = data.votes;
//         let totalVotes = votes.length;
//         console.log(totalVotes)
//         document.querySelector('#chartTitle').textContent = `Total Votes: ${totalVotes}`;

//         let voteCounts = {
//             Candidate1: 0,
//             Candidate2: 0,
//             Candidate3: 0,
//             Candidate4: 0
//         };

//         voteCounts = votes.reduce((acc, vote) => (
//             (acc[vote.candidate] = (acc[vote.candidate] || 0) + parseInt(vote.points)), acc),
//             {}
//         );

//         let dataPoints = [
//             { label: 'Candidate1', y: voteCounts.Candidate1},
//             { label: 'Candidate2', y: voteCounts.Candidate2 },
//             { label: 'Candidate3', y: voteCounts.Candidate3 },
//             { label: 'Candidate4', y: voteCounts.Candidate4 },
//         ];
            
//         const chartContainer = document.querySelector('#chartContainer');
        
//         if(chartContainer){
//             console.log("manan")
//             // Listen for the event.
//             document.addEventListener('votesAdded', function (e) { 
//                 document.querySelector('#chartTitle').textContent = `Total Votes: ${e.detail.totalVotes}`;
//             });
            
//             const chart = new CanvasJS.Chart('chartContainer', {
//                 animationEnabled: true,
//                 theme: 'theme1',
//                 data:[
//                     {
//                         type: 'column',
//                         dataPoints: dataPoints
//                     }
//                 ]
//             });
            
//             chart.render();
        
//              // Enable pusher logging - don't include this in production
//              Pusher.logToConsole = true;
        
//              var pusher = new Pusher('2d4454b084d59ea08a0b', {
//                 cluster: 'ap2',
//                 encrypted: true
//                 });
         
//              var channel = pusher.subscribe('candidate-poll');

//              channel.bind('vote', function(data) {
//                dataPoints.forEach((point)=>{
//                    if(point.label==data.candidate)
//                    {
//                         point.y+=data.points;
//                         totalVotes+=data.points;
//                         event = new CustomEvent('votesAdded',{detail:{totalVotes:totalVotes}});
//                         // Dispatch the event.
//                         document.dispatchEvent(event);
//                         console.log("done")
//                    }
//                    else{
//                        console.log("-_-")
//                    }
//                });
//                chart.render();
//              });
//         }

// });

/*
fetch('http://localhcandidatet:3000/poll')
    .then(res => res.json())
    .then(data => {
        let votes = data.votes;
        let totalVotes = votes.length;
        document.querySelector('#chartTitle').textContent = `Total Votes: ${totalVotes}`;

        let voteCounts = {
            Candidate1: 0,
            Candidate2: 0,
            Candidate3: 0,
            Candidate4: 0
        };

        voteCounts = votes.reduce((acc, vote) => (
            (acc[vote.candidate] = (acc[vote.candidate] || 0) + parseInt(vote.points)), acc),
            {}
        );

        let dataPoints = [
            { label: 'Candidate1', y: voteCounts.Candidate1},
            { label: 'Candidate2', y: voteCounts.Candidate2 },
            { label: 'Candidate3', y: voteCounts.Candidate3 },
            { label: 'Candidate4', y: voteCounts.Candidate4 },
        ]    
            
    const chartContainer = document.querySelector('#chartContainer');
        
    if(chartContainer){
        document.addEventListener('votesAdded', function (e) { 
            document.querySelector('#chartTitle').textContent = `Total Votes: ${e.detail.totalVotes}`;
        });
        const chart = new CanvasJS.Chart('chartContainer',{       
            theme:'theme2',
            animationEnabled: true,
            title:{
                text:'Election Results'
            },
            data:[
                {type:'column',
                dataPoints : dataPoints
                }
            ]
        });
        chart.render();


        Pusher.logToConsole = true;

        var pusher = new Pusher('2d4454b084d59ea08a0b', {
        cluster: 'ap2'
        });

        var channel = pusher.subscribe('candidate-poll');// acting as a subscriber to the candidate channel hence will receive any updates 
        channel.bind('vote', function(data) {// vote is the event 
            dataPoints.forEach((point)=>{
                if(point.label==data.candidate)
                {
                    point.y+=data.points;
                    totalVotes+=data.points;
                    myevent = new CustomEvent('votesAdded',{detail:{totalVotes:totalVotes}});
                    // Dispatch the event.
                    document.dispatchEvent(myevent);
                }
            });
            chart.render();//updated votes are rendered after a vote is cast
        });
    }
});
*/