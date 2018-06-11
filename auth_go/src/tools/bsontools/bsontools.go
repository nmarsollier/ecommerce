package bsontools

import (
	"github.com/mongodb/mongo-go-driver/bson"
)

// LookupStringDefault will return key value or default value if missing.
func LookupStringDefault(d bson.Document, key string, def string) string {
	elem, err := d.LookupErr(key)
	if err != nil {
		return def
	}

	return elem.StringValue()
}

// LookupString will return key value or default value if missing.
func LookupString(d bson.Document, key string) string {
	return LookupStringDefault(d, key, "")
}

// LookupBoolDefault will return key value or default value if missing.
func LookupBoolDefault(d bson.Document, key string, def bool) bool {
	elem, err := d.LookupErr(key)
	if err != nil {
		return def
	}

	return elem.Boolean()
}

// LookupBool will return key value or default value if missing.
func LookupBool(d bson.Document, key string) bool {
	return LookupBoolDefault(d, key, false)
}

// LookupStringArrayDefault will return key value or default value if missing.
func LookupStringArrayDefault(d bson.Document, key string, def []string) []string {
	elem, err := d.LookupErr(key)

	if err != nil {
		return def
	}

	array, ok := elem.MutableArrayOK()
	if !ok {
		return def
	}

	result := make([]string, array.Len())
	for i := 0; i < array.Len(); i++ {
		rol, _ := array.Lookup(uint(i))
		result[i] = rol.StringValue()
	}

	return result
}

// LookupStringArray will return key value or default value if missing.
func LookupStringArray(d bson.Document, key string) []string {
	return LookupStringArrayDefault(d, key, []string{})
}

// LookupObjectIDDefault will return key value or default value if missing.
func LookupObjectIDDefault(d bson.Document, key string, def string) string {
	elem, err := d.LookupErr(key)
	if err != nil {
		return def
	}

	return elem.ObjectID().Hex()
}

// LookupObjectID will return key value or default value if missing.
func LookupObjectID(d bson.Document, key string) string {
	return LookupObjectIDDefault(d, key, "")
}
