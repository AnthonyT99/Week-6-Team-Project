class Car {
    constructor(name) {
        this.name = name;
        this.rooms = [];
    }

    addRoom(name, area) {
        this.rooms.push(new Room(name, area));
    }
}

class Room {
    constructor(name, area) {
        this.name = name;
        this.area = area;
    }
}

class CarService {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';

    static getAllCars() {
        return $.get(this.url);
    }

    static getCar(id) {
        return $.get(this.url + `/${id}`);
    }

    static createCar(car) {
        return $.post(this.url, car);
    }

    static updateCar(car) {
        return $.ajax({
            url: this.url + `/${car._id}`,
            dataType: 'json',
            data: JSON.stringify(car),
            contentType: 'application/json',
            type: 'PUT'
        })
    }

    static deleteCar(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }

}

class DOMManager {
    static cars;

    static getAllCars() {
        CarService.getAllCars().then(cars => this.render(cars));
    }

    static createCar(name) {
        CarService.createCar(new Car(name))
        .then(() => {
            return CarService.getAllCars();
        })
        .then((cars) => this.render(cars));
    }


    static deleteCar(id) {
        console.log(id)
        CarService.deleteCar(id)
        .then(() => {
            return CarService.getAllCars();
        })
        .then((cars) => this.render(cars));
    }

    static addRoom(id) {
        for (let car of this.cars) {
            if (car._id == id) {
                car.rooms.push(new Room($(`#${car._id}-room-name`).val(), $(`#${car._id}-room-area`).val()))
                CarService.updateCar(car)
                    .then(() => {
                        return CarService.getAllCars();
                    
                    })
                .then((cars) => this.render(cars));
                
            }
        }
    }

    static deleteRoom(carId, roomId) {
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

                            

                            <button id="${car._id}-new-room" onclick="DOMManager.addRoom('${car._id}')" class="btn btn-primary form-control">Add</button>

                        </div>
                    </div>

                </div><br>`

            );

            for (let room of car.rooms) {
                $(`#${car._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${room._id}"><strong>Make: </strong> ${room.name}</span>
                        <span id="area-${room._id}"><strong>Year: </strong> ${room.area}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${car._id}', '${room._id}')">Delete Car</button>
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