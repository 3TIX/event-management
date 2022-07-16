package io.github.hackfs2022.http;

import io.javalin.apibuilder.EndpointGroup;

public interface Resource {

    EndpointGroup routes();
}
