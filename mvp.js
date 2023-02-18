getReport = document.getElementById("getForms").addEventListener('click', runProgram)

const apiKey = ""

function createURL() {
    // I need to add a "check" to make sure endDate is after startDate
    let startYear = document.getElementById('start').value.slice(0,4)
    let startMonth = document.getElementById('start').value.slice(5,7)
    let startDay = document.getElementById('start').value.slice(8,10)
    let endYear = document.getElementById('end').value.slice(0,4)
    let endMonth = document.getElementById('end').value.slice(5,7)
    let endDay = document.getElementById('end').value.slice(8,10)
    let selectedstate = document.getElementById('state').value
    let selectedBuilder = document.getElementById('builder').value
  
    // Set Builder Variable for Request URL
    if(selectedBuilder === "allbuilders") {
        var builder = ''
    }
  
  
    // Set State Variable for Request URL
    if(selectedstate === "AZ") {
        var state = 'state=AZ&'
    }
  
    let selectedURL = `https://api.ekotrope.com/api/v1/projects?${builder}${state}status=SUBMITTED_TO_REGISTRY&created_after=${startYear}-${startMonth}-${startDay}T00%3A00%3A00.000-07%3A00&created_before=${endYear}-${endMonth}-${endDay}T23%3A59%3A01.000-07%3A00`
  
    // console.log(selectedURL)
  
    return selectedURL
}


async function getProjectList(url) {
    return fetch(url, {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": apiKey
    }
    })
    .then((response) => response.json())
    .then((data) => {
        let _IDs = []
        data.forEach(async function(project){
        _IDs.push(await project.id)
    })
        return _IDs
    })
    .catch(err => {
        console.log(err)
        console.log("... in Project List")
    })
}


async function getProjectInfo(projectID) {
    return fetch("https://api.ekotrope.com/api/v1/projects/"+projectID, {
        "method": "GET",
        "headers": {
        "Content-Type": "application/json",
        "Authorization": apiKey
        }
    })
    .then(response => response.json())
    .then(async data => {
        let combinedData = data
        let plan = data.hersRatingDetails.submittedPlanId
        combinedData["ratingData"] = await getRatingInfo(plan)
        return combinedData
    })
    .catch(err => {
        console.error(err)
        console.log("... in Project Info")
    })
}


  async function getRatingInfo(planID) {
    return fetch("https://api.ekotrope.com/api/v1/planAnalysis/" + planID + "?buildingType=HERSRated&codesToCheck=EnergyStarV3&codesToCheck=EnergyStarV31&codesToCheck=TaxCredit45L", {
        "method": "GET",
        "headers": {
        "Content-Type": "application/json",
        "Authorization": apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
    //   console.log(data)
      return data })
    .catch(err => {
        console.error(err)
        console.log("...in Rating Info")
    })
}


//   Run Program
async function runProgram(event) {
    event.preventDefault()
    console.log("Started")

    const requestURL = createURL()
    console.log(requestURL)

    let projectList = await getProjectList(requestURL)
    console.log(projectList)

    let projects = []
    for (const prjID of projectList)
      projects.push(await getProjectInfo(prjID))
    console.log(projects.length)
    console.log("Got Projects")
    // TODO: Loop through Projects array and create a HERS form for each Project.


    console.log("Ended")
}