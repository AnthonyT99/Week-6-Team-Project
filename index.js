// the car class gets the Brand and Model of the car
class Car {
    constructor(brand) {
        this.name = brand;
        this.rooms = [];
    }

    // A funcation to push the brand and year of the car
    addModel(brand, year) {
        this.rooms.push(new Model(brand, year));
    }
}


// The model class takes the name of the manufacturer and the year of the car
class Model {
    constructor(name, year) {
        this.name = name;
        this.area = year;
    }
}

// The CarService class places the cars manufacturer and types into the url
class CarService {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';

    static getAllCars() {
        return $.get(this.url);
    }

    // It also gets the cars ID after they are placed
    static getCar(id) {
        return $.get(this.url + `/${id}`);
    }

    // Also is used to create the cars to allow them to show up and get IDs
    static createCar(car) {
        return $.post(this.url, car);
    }

    // updates the cars to there new inforamtion
    static updateCar(car) {
        return $.ajax({
            url: this.url + `/${car._id}`,
            dataType: 'json',
            data: JSON.stringify(car),
            contentType: 'application/json',
            type: 'PUT'
        })
    }

    // Allows for cars to be deleted
    static deleteCar(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }

}

// The DOMManager renders the whole thing
class DOMManager {
    static cars;

    // getAllCars is getting the car for the info of the model and year
    static getAllCars() {
        CarService.getAllCars().then(cars => this.render(cars));
    }

    // creates the car that has the model and year under the manufacturer
    static createCar(name) {
        CarService.createCar(new Car(name))
        .then(() => {
            return CarService.getAllCars();
        })
        .then((cars) => this.render(cars));
    }

    // Deletes the car under the manufacturer
    static deleteCar(id) {
        console.log(id)
        CarService.deleteCar(id)
        .then(() => {
            return CarService.getAllCars();
        })
        .then((cars) => this.render(cars));
    }

    // Adds the model of car under the manufacturer
    static addModel(id) {
        for (let car of this.cars) {
            if (car._id == id) {
                car.rooms.push(new Model($(`#${car._id}-room-name`).val(), $(`#${car._id}-room-area`).val()))
                CarService.updateCar(car)
                    .then(() => {
                        return CarService.getAllCars();
                    
                    })
                .then((cars) => this.render(cars));
                
            }
        }
    }

    // Deletes the model under the manufacturer
    static deleteModel(carId, roomId) {
        for (let car of this.cars) {
            if (car._id == carId) {
                for (let room of car.rooms) {
                    if (room._id == roomId) {
                        console.log("car " + car)
                        console.log("room " + room)
                        car.rooms.splice(car.rooms.indexOf(room), 1);
                        CarService.updateCar(car)
                        .then(() => {
                            return CarService.getAllCars();
                        })
                        .then((cars) => this.render(cars));
                    }
                }
            }
        }
    }

    // renders the information of the cars model and year under the manufacturer
    static render(cars) {
        this.cars = cars;
        $('#app').empty();
        for (let car of cars) {
            $('#app').prepend(
                `<div id="${car._id}" class="card">
                    <div class="card-header">
                        <h2>${car.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteCar('${car._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card"> 
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${car._id}-room-name" class="form-control" placeholder="Car Model">
                                </div>
                                <div class="col-sm">
                                <input type="text" id="${car._id}-room-area" class="form-control" placeholder="Model Year">
                                </div>
                            </div>
                            
                            <button id="${car._id}-new-room" onclick="DOMManager.addModel('${car._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`

            );

            for (let room of car.rooms) {
                $(`#${car._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${room._id}"><strong>Make: </strong> ${room.name}</span>
                        <span id="area-${room._id}"><strong>Year: </strong> ${room.area}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteModel('${car._id}', '${room._id}')">Delete Car</button>
                        `
                )
            }

        }
    }
}

$('#create-new-car').click(() => {
    DOMManager.createCar($('#new-car-name').val());
    $('#new-car-name').val('');
});

DOMManager.getAllCars();