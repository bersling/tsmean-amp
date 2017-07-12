const roadmapData: RoadmapData = [
  {
    laneTitle: "Documentation",
    laneData: [
      {start: new Date(2017, 6, 4), end: new Date(2017, 6, 5), title: "Roadmap"},
      {start: new Date(2017, 6, 5), end: new Date(2017, 6, 7), title: "User module"}
    ]
  }
  ,
  {
    laneTitle: "Frontend",
    laneData: [
      {start: new Date(2017, 6, 4), end: new Date(2017, 6, 5), title: "Prettify"},
      {start: new Date(2017, 6, 5), end: new Date(2017, 6, 6), title: "About page"}
    ]
  }
  ,
  {
    laneTitle: "Backend",
    laneData: [
      {start: new Date(2017, 6, 4), end: new Date(2017, 6, 11), title: "Sessions"},
      {start: new Date(2017, 6, 11), end: new Date(2017, 6, 18), title: "Protect endpoints"}
    ]
  }
  ,
  {
    laneTitle: "Marketing",
    laneData: [
      {start: new Date(2017, 9, 1), end: new Date(2017, 10, 1), title: "Tell friends"},
      {start: new Date(2017, 10, 1), end: new Date(2017, 11, 1), title: "Facebook Campaign"}
    ]
  }
];

const roadmapConfig = {
  totalHeight: 2500, // height in pixel
  start: new Date(2017, 6, 1),
  end: new Date(2017, 12, 31),
  pixelsPerDay: function() {
    return this.totalHeight / this.totalDays();
  },
  dayPosition: function(date: Date) {
    const daysAfterStart = dateDiffInDays(this.start, date);
    return daysAfterStart * this.pixelsPerDay();
  },
  totalDays: function() {
    return dateDiffInDays(this.start, this.end)
  }
}

type RoadmapData = RoadmapLane[];

interface RoadmapLane {
  laneTitle: string,
  laneData: RoadmapDataPoint[]
}

interface RoadmapDataPoint {
  start: Date;
  end: Date;
  title: string
}

const roadmapContainer: HTMLElement = document.getElementById("roadmap-container");

function buildLanes () {
  roadmapData.forEach(lane => {
    const laneElt = buildLane(lane);
    roadmapContainer.appendChild(laneElt);
  });
}
buildLanes();

function buildLaneTitles() {
  const laneTitles: HTMLElement = document.getElementById("roadmap-lane-titles");
  roadmapData.forEach(lane => {
    const laneTitle = buildLaneTitle(lane.laneTitle);
    laneTitles.appendChild(laneTitle);
  })
}
buildLaneTitles();

function buildLane(lane: RoadmapLane): HTMLElement {
  const laneContent = buildLaneContent(lane.laneData);
  laneContent.style.flexGrow = '1';
  return laneContent;
}

function buildLabels() {
  const labelContainer: HTMLElement = document.getElementById("roadmap-labels");
  for (let i = 0; i < roadmapConfig.totalDays(); i++) {
    var someDate = new Date(roadmapConfig.start);
    var numberOfDaysToAdd = i;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

    const div = document.createElement("DIV");
    const textnode = document.createTextNode(formatDate(someDate));
    div.appendChild(textnode);
    div.classList.add('roadmap-label');
    div.style.top = i * roadmapConfig.pixelsPerDay()  + 'px';
    labelContainer.appendChild(div);
  }
}
buildLabels();

function buildLaneTitle(title: string): HTMLElement {
  const elt = document.createElement("h3");
  elt.classList.add('lane-title');
  const textnode = document.createTextNode(title);
  elt.appendChild(textnode);
  return elt;
}

function buildLaneContent(laneData: RoadmapDataPoint[]): HTMLElement {
  const laneContentElt = document.createElement("DIV");
  laneContentElt.classList.add('lane-content');
  laneData.forEach(dataPoint => {
    const dataPointElement = buildDataPointElement(dataPoint);
    laneContentElt.appendChild(dataPointElement);
  })
  return laneContentElt;
}

function buildDataPointElement(dataPoint: RoadmapDataPoint): HTMLElement {

  const div = document.createElement("DIV");
  const textnode = document.createTextNode(dataPoint.title);
  div.appendChild(textnode);
  div.classList.add('lane-element');
  // div.style.background = getRandomLightColor();
  div.style.top = roadmapConfig.dayPosition(dataPoint.start) + 'px';
  const height = dateDiffInDays(dataPoint.start, dataPoint.end) *
    roadmapConfig.pixelsPerDay();
  div.style.height = height + 'px';
  div.style.maxHeight = height + 'px';
  return div;
}

// a and b are javascript Date objects
function dateDiffInDays(a: Date, b: Date): number {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


function formatDate(date) {
  var mm = date.getMonth(); // getMonth() is zero-based
 var dd = date.getDate();

 var monthNames = [
   "Jan", "Feb", "Mar",
   "Apr", "May", "Jun", "Jul",
   "Aug", "Sep", "Oct",
   "Nov", "Dec"
 ];

 return [date.getFullYear(),
         monthNames[mm],
         (dd>9 ? '' : '0') + dd
       ].join(' - ');
}


function getRandomLightColor() {
  var letters = 'ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 6)];
  }
  return color;
}
