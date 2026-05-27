package theme

import "fmt"

type Variant struct {
	Name   string
	Accent string
}

func (v *Variant) Render() string {
	if v.Accent == "" {
		return v.Name
	}
	return fmt.Sprintf("%s [%s]", v.Name, v.Accent)
}
