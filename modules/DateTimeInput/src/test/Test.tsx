import {intl} from "@co.mmons/js-intl";
import {LocalDate, NoTimeDate, TimeZoneDate} from "@co.mmons/js-utils/core";
import {Component, h, Host} from "@stencil/core";
import {FormController, FormField} from "ionx/forms";
import {Grid, GridCol, GridRow} from "ionx/Grid";

import {DateTimeInput} from "../index";

const instanceNoTimeDate = new NoTimeDate(Date.UTC(2022, 2, 1));
const instanceTimeZoneDate = new TimeZoneDate(new Date(2022, 4, 2, 13, 13, 13, 134));
const instanceTimeZoneDateNewYork = new TimeZoneDate(instanceTimeZoneDate, "America/New_York");
const instanceLocalDate = new LocalDate(2022, 4, 2, 13, 13, 13, 0);

@Component({
    tag: "ionx-test"
})
export class Test {

    form = new FormController({
        date1: {value: instanceTimeZoneDateNewYork},

        dateOnly1: {value: undefined as Date},
        dateOnly2: {value: instanceTimeZoneDate},
        dateOnly3: {value: instanceLocalDate},

        localDate1: {value: undefined as Date},
        localDate2: {value: instanceLocalDate}

    }).bindRenderer(this)

    render() {

        const {form} = this;
        const {controls} = form;

        return <Host>

            <Grid>

                <h1>Date time</h1>

                <GridRow>
                    <GridCol>
                        <FormField label="time zone required">
                            <DateTimeInput type="date-time" ref={controls.date1.attach()}/>
                            <div slot="hint">{intl.dateTimeFormat(controls.date1.value)}</div>
                        </FormField>
                    </GridCol>
                </GridRow>

                <GridRow>
                    <GridCol>
                        <FormField label="time zone not required">
                            <DateTimeInput type="date-time" placeholder="Shalalala" timeZoneRequired={false}/>
                        </FormField>
                    </GridCol>
                </GridRow>

                <h1>Local date</h1>

                <GridRow>
                    <GridCol sizeMd={3}>
                        <FormField label="initial">
                            <DateTimeInput type="local-date-time" ref={controls.localDate1.attach()}
                                           initialValue={instanceNoTimeDate} placeholder="Choose..."/>

                            <div slot="hint">{controls.localDate1.value?.toString()}</div>
                        </FormField>
                    </GridCol>

                    <GridCol sizeMd={3}>
                        <FormField label="LocalDate">
                            <DateTimeInput type="local-date-time" ref={controls.localDate2.attach()}/>
                        </FormField>
                    </GridCol>

                </GridRow>

                <h1>Date only</h1>

                <GridRow>
                    <GridCol sizeMd={3}>
                        <FormField label="initial NoTimeDate">
                            <DateTimeInput type="date" ref={controls.dateOnly1.attach()}
                                           initialValue={instanceNoTimeDate} placeholder="Choose..."/>

                            <div slot="hint">{controls.dateOnly1.value?.toString()}</div>
                        </FormField>
                    </GridCol>

                    <GridCol sizeMd={3}>
                        <FormField label="TimeZoneDate">
                            <DateTimeInput type="date" ref={controls.dateOnly2.attach()}/>
                        </FormField>
                    </GridCol>

                    <GridCol sizeMd={3}>
                        <FormField label="LocalDate">
                            <DateTimeInput type="date" ref={controls.dateOnly3.attach()}/>
                        </FormField>
                    </GridCol>
                </GridRow>
            </Grid>

        </Host>
    }
}
