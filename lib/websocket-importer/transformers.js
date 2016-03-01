const transform = (message) => {
	// Convert to two-dimensional (latitude, longitude) array, excluding GeoJSON altitude
	if (message.data.geometry.coordinates.length > 2) {
	  message.data.geometry.coordinates.pop();
	}

	message.data.properties.update = message.action === 'create' ? false : true;

	// capitalize flynn_region
	message.data.properties.location = message.data.properties.flynn_region.toLowerCase().split(" ").map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(" ");

	message.data.properties.source = message.data.properties.source_catalog;

	message.data.properties.url = `http://www.seismicportal.eu/eventdetails.html?unid=${message.data.properties.unid}`;
	message.data.properties.details = `http://www.seismicportal.eu/fdsnws/event/1/query?format=json&includeallorigins=true&includearrivals=true&eventid=${message.data.properties.unid}`;

	delete message.data.id, message.action, 
			message.data.properties.source_catalog,
			message.data.properties.flynn_region;
	return message.data;
};

module.exports.mapping = {
  seismicportal: transform
};