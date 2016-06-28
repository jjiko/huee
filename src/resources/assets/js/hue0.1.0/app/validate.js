module.exports = {
    date: function(d){
        return ( Object.prototype.toString.call(d) === "[object Date]" && !isNaN(d.getTime()) );
    },
    isNull: function(v) {
      return !this.notNull(v);
    },
    notNull: function(v) {
        return (typeof(v) !== "undefined") && (v !== null) && (v !== "null");
    }
}