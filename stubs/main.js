
var initialIdeas = [{ id: faker.random.uuid(), title: "Placeholder 1 Title", body: "Placeholder 1 Body", created_date: new Date()}, { id: faker.random.uuid(), title: "Placeholder 2 Title", body: "Placeholder 2 Body", created_date: new Date()}];

function initStateIdeas(){
    state.ideas = _.clone(initialIdeas);
}
// init during app start
initStateIdeas();
// Reset
Sandbox.define('/ideas/reset', 'GET', function(req, res) {
    initStateIdeas();
    res.send(state.ideas);
});
// Get Ideas
Sandbox.define('/ideas', 'GET', function(req, res) {
    res.send(state.ideas);
});

// New Idea
Sandbox.define('/ideas/new', 'GET', function(req, res) {
    // retrieve users or, if there are none init, to empty array
    var idea = { id: faker.random.uuid(), created_date: new Date()};
    state.ideas.push(idea);
    return res.json(idea);
});

// Partial Update
Sandbox.define('/idea/{id}', 'PATCH', function(req, res) {
    var id = req.params.id;
    var ideaIndex = _.findIndex(state.ideas, {id: id});
    if(ideaIndex === -1){
        return res.json(404, { error: { message: "Idea does not exist" } })
    }
    var bodyContent = req.body;
    var ideaBody = {};
    if(bodyContent.title || bodyContent.title === ""){
        ideaBody.title = bodyContent.title;
    }
    if(bodyContent.body || bodyContent.body === ""){
        ideaBody.body = bodyContent.body;
    }
    state.ideas[ideaIndex] = _.assign({}, state.ideas[ideaIndex], ideaBody);
    return res.send(state.ideas[ideaIndex]);
});

// Delete Idea
Sandbox.define('/idea/{id}', 'DELETE', function(req, res) {
    var id = req.params.id;
    var ideaIndex = _.findIndex(state.ideas, {id: id});
    if(ideaIndex === -1){
        return res.json(404, { error: { message: "Idea does not exist" } })
    }
    // Remove the given idea
    var removedIdea = state.ideas.splice(ideaIndex, 1);
    return res.send(removedIdea);
});