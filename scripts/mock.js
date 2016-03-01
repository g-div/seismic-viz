import http from 'http';
import sockjs from 'sockjs';
import moment from 'moment';
const mock = sockjs.createServer();
const server = http.createServer();

mock.installHandlers(server, {prefix:'/standing_order'});

const createMessages = (random) => {
  return [`{
    "action": "update",
    "data": {
      "geometry": {
        "type": "Point",
        "coordinates": [-71.81, -31.52, -38.0]
      },
      "type": "Feature",
      "id": "20151103_0000073",
      "properties": {
        "auth": "GUC",
        "depth": 38,
        "evtype": "ke",
        "flynn_region": "OFFSHORE COQUIMBO, CHILE",
        "lastupdate": "${moment().format()}",
        "lat": -31.52,
        "lon": -71.81,
        "mag": 3.8,
        "magtype": "ml",
        "source_catalog": "EMSC-RTS",
        "source_id": "471903",
        "time": "${moment().subtract(10, 'minutes').format()}",
        "unid": "20151122_0000086"
      }
    }
  }`, `{
    "action": "create",
    "data": {
      "geometry": {
        "type": "Point",
        "coordinates": [71.2, 36.74, -180.0]
      },
      "type": "Feature",
      "id": "20151103_0000073",
      "properties": {
        "auth": "NEIC",
        "depth": 190,
        "evtype": "ke",
        "flynn_region": "HINDU KUSH REGION, AFGHANISTAN",
        "lastupdate": "${moment().format()}",
        "lat": 36.74,
        "lon": 71.2,
        "mag": 4.1,
        "magtype": "mb",
        "source_catalog": "EMSC-RTS",
        "source_id": "472271",
        "time": "${moment().subtract(10, 'minutes').format()}",
        "unid": "20151124_0000073"
      }
    }
  }`, `{
    "action": "create",
    "data": {
      "geometry": {
        "type": "Point",
        "coordinates": [-80.98, 12.71, -75.0]
      },
      "type": "Feature",
      "id": "20151103_0000073",
      "properties": {
        "auth": "NEIC",
        "depth": 75,
        "evtype": "ke",
        "flynn_region": "NEAR COAST OF NICARAGUA",
        "lastupdate": "${moment().format()}",
        "lat": 12.71,
        "lon": -80.98,
        "mag": 4.3,
        "magtype": "mb",
        "source_catalog": "EMSC-RTS",
        "source_id": "472342",
        "time": "${moment().subtract(10, 'minutes').format()}",
        "unid": "20151124_0000119"
      }
    }
  }`, `{
    "action": "create",
    "data": {
      "geometry": {
        "type": "Point",
        "coordinates": [71.2, 36.44, -75.0]
      },
      "type": "Feature",
      "id": "20151103_0000073",
      "properties": {
        "auth": "EMSC",
        "depth": 108,
        "evtype": "ke",
        "flynn_region": "HINDU KUSH REGION, AFGHANISTAN",
        "lastupdate": "${moment().format()}",
        "lat": 36.44,
        "lon": 71.2,
        "mag": 4.3,
        "magtype": "mb",
        "source_catalog": "EMSC-RTS",
        "source_id": "472056",
        "time": "${moment().subtract(10, 'minutes').format()}",
        "unid": "20151123_0000068"
      }
    }
  }`][random]
};


mock.on('connection', function(conn) {
  setInterval(function () {
    let message = createMessages(parseInt(Math.random() * (3-0)));
    conn.write(message);
  }, process.env.MOCK_INTERVAL || 10000);
});

server.listen(process.env.MOCK_PORT || 9090);