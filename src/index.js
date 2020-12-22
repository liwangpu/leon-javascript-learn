window.onload = function () {
    renderGantt();
}

function renderGantt() {
    var tasks = {
        data: [
            {
                id: 1,
                text: "Project #2",
                start_date: "2020-01-01",
                duration: 4,
                progress: 0.4,
                open: true
            },
            {
                id: 2,
                text: "Task #1",
                start_date: "2020-01-01",
                duration: 6,
                progress: 0.6,
                parent: 1
            },
            {
                id: 3,
                text: "Task #2",
                start_date: "2020-01-01",
                duration: 2,
                order: 20,
                progress: 0.6,
                parent: 1
            }
        ],
        // links: [
        //     { id: 1, source: 1, target: 2, type: "1" },
        //     { id: 2, source: 2, target: 3, type: "0" }
        // ]
    };

    gantt.config.auto_types = true;
    gantt.config.open_split_tasks = true;
    gantt.config.date_format = "%Y-%m-%d %H:%i:%s";
    gantt.config.scales = [
        { unit: "month", step: 1, format: "%Y年%m月" },
        { unit: "day", step: 1, format: "%d" },
        { unit: "hour", step: 1, format: "%H" },
    ];
    gantt.config.duration_unit = 'hour'
    gantt.config.duration_step = 1;

    gantt.init("gantt-container");


    gantt.parse(tasks);
}