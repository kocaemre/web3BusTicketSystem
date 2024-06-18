//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";

contract YourContract is Ownable {
	//iade etme fonksiyonu ekle

    event TicketBooked(address seatOwnerAdress, uint256 index, uint256 seatNumber);
    

	struct BusTicket {
		string from;
		string to;
		string date;
		string duration;
		uint256 price;
		uint256 seatCapacity;
		uint256 availableSeat;
		
		bool[] seatMap;
	}

	uint256 public id=0;

	mapping(uint256 => mapping(address => uint256)) public seatOwner; // mapping of ticket ID to owner's seat number

	BusTicket[] public busTickets;

	function getSeatMap(uint256 index) public view returns (bool[] memory) {
		return busTickets[index].seatMap;
	}


	function addBusTicket(
		string memory _from,
		string memory _to,
		string memory _date,
		string memory _duration,
		uint256 _price,
		uint256 _seatCapacity
	) public onlyOwner {
		require(_seatCapacity > 0, "Seat capacity must be greater than 0");
		require(_price > 0, "Price must be greater than 0");
		bool[] memory _array = new bool[](_seatCapacity+1);

		busTickets.push(
			BusTicket(
				_from,
				_to,
				_date,
				_duration,
				_price,
				_seatCapacity,
				_seatCapacity,
				_array
			)
		);
		id++;
	}

	function bookTicket(uint256 seatNumber, uint256 index) public payable {
        require(seatNumber > 0, "Seat number must be greater than 0");
		require(index < busTickets.length, "Bus ticket index out of bounds");
		require(
			seatNumber < busTickets[index].seatCapacity,
			"Seat number is greater than seat capacity"
		);
		require(
			busTickets[index].seatMap[seatNumber] == false,
			"Seat is already booked"
		);
		require(
			msg.value == busTickets[index].price,
			"Please send the correct amount of ETH"
		);
		require(
			seatOwner[index][msg.sender] == 0,
			"You have already booked a seat"
		);

		busTickets[index].availableSeat--;
		busTickets[index].seatMap[seatNumber] = true;
		seatOwner[index][msg.sender] = seatNumber;
        emit TicketBooked(msg.sender, index, seatNumber);
	}

	function withdraw() public onlyOwner {
		// Call returns a boolean value indicating success or failure.
		// This is the current recommended method to use.
		(bool sent, ) = msg.sender.call{ value: address(this).balance }("");
		require(sent, "Failed to send Ether");
	}
}
